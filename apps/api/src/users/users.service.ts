// src/users/users.service.ts
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuditAction, Role } from '../../generated/prisma/client/enums';
import { Prisma } from '../../generated/prisma/client/client';
import { AuditService } from '../audit/audit.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { generateUserId } from '../auth/helpers/user-id.helper';

const BCRYPT_ROUNDS = 12;

const CREATION_PERMISSIONS: Record<Role, Role[]> = {
    [Role.SUPER_ADMIN]: [Role.SUPER_ADMIN, Role.MANAGER, Role.PARTNER, Role.CUSTOMER],
    [Role.MANAGER]: [Role.PARTNER, Role.CUSTOMER],
    [Role.PARTNER]: [Role.CUSTOMER],
    [Role.CUSTOMER]: [],
};

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
        private readonly auditService: AuditService,
    ) { }

    async createUser(actor: JwtPayload, dto: CreateUserDto) {
        // 1. Permission check
        const allowed = CREATION_PERMISSIONS[actor.role] ?? [];
        if (!allowed.includes(dto.role)) {
            throw new ForbiddenException(
                `A ${actor.role} cannot create a ${dto.role} account`,
            );
        }

        // 2. Email uniqueness
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (existing) throw new ConflictException('Email already registered');

        // 3. Credentials
        const userId = await this.generateUniqueUserId();
        const rawPass = this.generateTempPassword();
        const passHash = await bcrypt.hash(rawPass, BCRYPT_ROUNDS);

        const isCustomerByPartner =
            dto.role === Role.CUSTOMER && actor.role === Role.PARTNER;

        // 4. Build profile data — only include customer fields when role is CUSTOMER
        const profileData: Prisma.UserProfileCreateWithoutUserInput =
            dto.role === Role.CUSTOMER
                ? {
                    title: dto.title!,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    gender: dto.gender!,
                    phone: dto.phone!,
                    email: dto.email.toLowerCase().trim(),
                    country: dto.country!,
                    debtRange: dto.debtRange!,
                    companyName: dto.companyName ?? null,
                }
                : {
                    // Non-customer: only basics, customer-specific fields get DB defaults
                    title: 'MR',          // placeholder — not meaningful for staff
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    gender: 'PREFER_NOT_TO_SAY',
                    phone: dto.phone ?? '',
                    email: dto.email.toLowerCase().trim(),
                    country: 'ENGLAND',     // placeholder
                    debtRange: 'LESS_THAN_5000', // placeholder
                    companyName: dto.companyName ?? null,
                };

        const user = await this.prisma.user.create({
            data: {
                userId,
                email: dto.email.toLowerCase().trim(),
                passwordHash: passHash,
                role: dto.role,
                isActive: true,
                activatedAt: new Date(),
                createdById: actor.sub,
                ...(isCustomerByPartner ? { partnerId: actor.sub } : {}),
                profile: { create: profileData },
            },
            include: { profile: true },
        });

        // 5. Emails
        if (isCustomerByPartner) {
            const partnerProfile = await this.prisma.userProfile.findUnique({
                where: { userId: actor.sub },
            });
            const partnerName = partnerProfile
                ? `${partnerProfile.firstName} ${partnerProfile.lastName}`
                : 'Your Adviser';

            void this.mailService.sendWelcomeCustomerByPartner({
                to: user.email, firstName: dto.firstName,
                userId: user.userId, password: rawPass, partnerName,
            });
            void this.mailService.sendPartnerNotification({
                to: actor.email,
                customerFirstName: dto.firstName,
                customerLastName: dto.lastName,
                customerEmail: user.email,
                customerUserId: user.userId,
            });
        } else {
            void this.mailService.sendWelcomeCustomerSelf({
                to: user.email, firstName: dto.firstName,
                userId: user.userId, password: rawPass,
            });
        }

        void this.auditService.log({
            actorId: actor.sub,
            action: AuditAction.ACCOUNT_CREATED,
            targetId: user.id,
            description: `${actor.role} ${actor.userId} created ${dto.role} ${user.userId}`,
            metadata: { role: dto.role, email: user.email } as Prisma.InputJsonValue,
        });

        this.logger.log(`${actor.role} created ${dto.role}: ${user.userId}`);

        return {
            message: `${dto.role} account created successfully`,
            userId: user.userId,
            email: user.email,
            role: user.role,
        };
    }

    async listUsers(actor: JwtPayload) {
        if (actor.role === Role.CUSTOMER) throw new ForbiddenException('Access denied');

        const where = actor.role === Role.PARTNER ? { partnerId: actor.sub } : {};

        return this.prisma.user.findMany({
            where,
            select: {
                id: true, userId: true, email: true,
                role: true, isActive: true, createdAt: true,
                profile: {
                    select: {
                        firstName: true, lastName: true,
                        phone: true, companyName: true,
                    },
                },
                partner: {
                    select: {
                        userId: true, email: true,
                        profile: { select: { firstName: true, lastName: true } },
                    },
                },
                createdBy: {
                    select: { userId: true, email: true, role: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getUser(actor: JwtPayload, targetUserId: string) {
        const user = await this.prisma.user.findUnique({
            where: { userId: targetUserId },
            include: {
                profile: true,
                partner: { select: { userId: true, email: true } },
                createdBy: { select: { userId: true, email: true, role: true } },
                customers: {
                    select: {
                        userId: true, email: true, isActive: true,
                        profile: { select: { firstName: true, lastName: true } },
                    },
                },
            },
        });

        if (!user) throw new NotFoundException('User not found');
        this.enforceReadAccess(actor, user);
        return user;
    }

    async updateUser(actor: JwtPayload, targetUserId: string, dto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { userId: targetUserId },
            include: { profile: true },
        });
        if (!user) throw new NotFoundException('User not found');

        this.enforceWriteAccess(actor, user);

        if (dto.partnerId && actor.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('Only Super Admins can reassign partner associations');
        }

        const changes: Record<string, { before: unknown; after: unknown }> = {};
        if (dto.email && dto.email !== user.email) {
            changes['email'] = { before: user.email, after: dto.email };
        }

        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: user.id },
                data: {
                    ...(dto.email ? { email: dto.email.toLowerCase().trim() } : {}),
                    ...(dto.partnerId !== undefined ? { partnerId: dto.partnerId } : {}),
                },
            }),
            this.prisma.userProfile.update({
                where: { userId: user.id },
                data: {
                    ...(dto.title ? { title: dto.title } : {}),
                    ...(dto.firstName ? { firstName: dto.firstName } : {}),
                    ...(dto.lastName ? { lastName: dto.lastName } : {}),
                    ...(dto.gender ? { gender: dto.gender } : {}),
                    ...(dto.phone ? { phone: dto.phone } : {}),
                    ...(dto.country ? { country: dto.country } : {}),
                    ...(dto.debtRange ? { debtRange: dto.debtRange } : {}),
                    ...(dto.companyName ? { companyName: dto.companyName } : {}),
                },
            }),
        ]);

        void this.auditService.log({
            actorId: actor.sub,
            action: AuditAction.USER_UPDATED,
            targetId: user.id,
            description: `${actor.role} ${actor.userId} updated ${user.role} ${user.userId}`,
            metadata: { changes } as Prisma.InputJsonValue,
        });

        return { message: 'User updated successfully' };
    }

    async deleteUser(actor: JwtPayload, targetUserId: string) {
        if (actor.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('Only Super Admins can delete users');
        }
        if (actor.userId === targetUserId) {
            throw new BadRequestException('You cannot delete your own account');
        }

        const user = await this.prisma.user.findUnique({ where: { userId: targetUserId } });
        if (!user) throw new NotFoundException('User not found');

        await this.prisma.user.delete({ where: { id: user.id } });

        void this.auditService.log({
            actorId: actor.sub,
            action: AuditAction.USER_DELETED,
            targetId: user.id,
            description: `SuperAdmin ${actor.userId} deleted ${user.role} ${user.userId}`,
        });

        return { message: 'User deleted' };
    }

    async getAuditLogs(actor: JwtPayload) {
        if (actor.role !== Role.SUPER_ADMIN) throw new ForbiddenException('Access denied');
        return this.auditService.getAll();
    }

    private enforceReadAccess(
        actor: JwtPayload,
        target: { id: string; role: Role; partnerId: string | null },
    ) {
        if (actor.role === Role.SUPER_ADMIN || actor.role === Role.MANAGER) return;
        if (actor.role === Role.PARTNER && target.partnerId === actor.sub) return;
        if (actor.sub === target.id) return;
        throw new ForbiddenException('Access denied');
    }

    private enforceWriteAccess(
        actor: JwtPayload,
        target: { id: string; role: Role; partnerId: string | null },
    ) {
        if (actor.role === Role.SUPER_ADMIN) return;
        if (actor.role === Role.MANAGER && target.role !== Role.SUPER_ADMIN) return;
        if (actor.role === Role.PARTNER && target.partnerId === actor.sub) return;
        if (actor.sub === target.id) return;
        throw new ForbiddenException('Access denied');
    }

    private async generateUniqueUserId(): Promise<string> {
        for (let i = 0; i < 5; i++) {
            const userId = generateUserId();
            const exists = await this.prisma.user.findUnique({
                where: { userId }, select: { id: true },
            });
            if (!exists) return userId;
        }
        throw new Error('Failed to generate unique userId');
    }

    private generateTempPassword(): string {
        const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const lower = 'abcdefghjkmnpqrstuvwxyz';
        const digits = '23456789';
        const special = '@$!%*?&';
        const all = upper + lower + digits + special;
        const rand = (s: string) => s[Math.floor(Math.random() * s.length)];

        const chars = [
            rand(upper), rand(lower), rand(digits), rand(special),
            ...Array.from({ length: 6 }, () => rand(all)),
        ];
        return chars.sort(() => Math.random() - 0.5).join('');
    }
}