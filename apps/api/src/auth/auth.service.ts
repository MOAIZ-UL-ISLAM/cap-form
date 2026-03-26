// src/auth/auth.service.ts
import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { AuditService } from '../audit/audit.service';
import { GeoService } from '../geo/geo.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import type { LoginDto } from './dto/login.dto';
import type { RegisterSelfDto } from './dto/register-self.dto';
import type { SetPasswordDto } from './dto/set-password.dto';
import { generateUserId } from './helpers/user-id.helper';
import { AuditAction, Role } from '../../generated/prisma/client/enums';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly geoService: GeoService,
        private readonly auditService: AuditService,
    ) { }

    // ── Customer self-register ─────────────────────────────────────────────────

    async registerSelf(dto: RegisterSelfDto, req: Request) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (existing) throw new ConflictException('Email already registered');

        const userId = await this.generateUniqueUserId();
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

        const user = await this.prisma.user.create({
            data: {
                userId,
                email: dto.email.toLowerCase().trim(),
                passwordHash,
                role: Role.CUSTOMER,
                isActive: true,          // self-registered = immediately active
                activatedAt: new Date(),
                activationIp: this.geoService.extractIp(req),
                profile: {
                    create: {
                        title: dto.title,
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        gender: dto.gender,
                        phone: dto.phone,
                        email: dto.email,
                        country: dto.country,
                        debtRange: dto.debtRange,
                    },
                }
            },
            select: { id: true, userId: true, email: true },
        });

        // Geo lookup (non-blocking)
        // In registerSelf — replace the existing geo void block
        void this.geoService.lookup(this.geoService.extractIp(req)).then(async (geo) => {
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    activationIp: geo.ip,
                    activationCity: geo.city,
                    activationCountry: geo.country,
                },
            });
        });

        // Send welcome email — no partner association
        void this.mailService.sendWelcomeCustomerSelf({
            to: user.email,
            firstName: dto.firstName,
            userId: user.userId,
            password: dto.password, // plain — one-time delivery
        });

        void this.auditService.log({
            actorId: user.id,
            action: AuditAction.ACCOUNT_CREATED,
            targetId: user.id,
            description: `Customer ${user.email} self-registered`,
            ipAddress: this.geoService.extractIp(req),
        });

        this.logger.log(`Customer self-registered: ${user.userId}`);

        return {
            message: 'Account created. Check your email for your login credentials.',
            userId: user.userId,
        };
    }

    // ── Login (all roles) ──────────────────────────────────────────────────────

    async login(dto: LoginDto, req: Request) {
        const ip = this.geoService.extractIp(req);
        const ua = req.headers['user-agent'] ?? '';

        const user = await this.prisma.user.findUnique({
            where: { userId: dto.userId },
            select: {
                id: true, userId: true, email: true,
                passwordHash: true, role: true, isActive: true,
            },
        });


        this.logger.debug(`Login attempt: userId=${dto.userId}`);
        this.logger.debug(`User found: ${!!user}`);
        this.logger.debug(`isActive: ${user?.isActive}`);
        this.logger.debug(`hasHash: ${!!user?.passwordHash}`);

        if (!user || !user.isActive || !user.passwordHash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) throw new UnauthorizedException('Invalid credentials');

        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date(), lastLoginIp: ip },
        });

        const geo = await this.geoService.lookup(ip);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date(), lastLoginIp: geo.ip },
        });

        void this.auditService.log({
            actorId: user.id,
            action: AuditAction.LOGIN,
            description: `${user.role} ${user.userId} logged in from ${geo.city}, ${geo.country}`,
            ipAddress: geo.ip,
            userAgent: ua,
            metadata: {
                city: geo.city,
                country: geo.country,
                region: geo.region,
                timezone: geo.timezone,
                isp: geo.isp,
            },
        });

        const payload: JwtPayload = {
            sub: user.id,
            userId: user.userId,
            email: user.email,
            role: user.role,
        };

        this.logger.log(`Login: ${user.userId} [${user.role}]`);

        return {
            accessToken: this.jwtService.sign(payload),
            userId: user.userId,
            role: user.role,
            email: user.email,
        };
    }

    // ── Activate (customer clicks email link) ──────────────────────────────────

    async activate(token: string, req: Request) {
        const ip = this.geoService.extractIp(req);

        const record = await this.prisma.activationToken.findUnique({
            where: { token },
            include: {
                user: { select: { id: true, email: true, userId: true } },
            },
        });

        if (!record) throw new BadRequestException('Invalid activation link');
        if (record.usedAt) throw new BadRequestException('Link already used');
        if (record.expiresAt < new Date()) {
            throw new BadRequestException('Link expired. Contact your adviser.');
        }

        const geo = await this.geoService.lookup(ip);

        await this.prisma.$transaction([
            this.prisma.activationToken.update({
                where: { id: record.id },
                data: { usedAt: new Date() },
            }),
            this.prisma.user.update({
                where: { id: record.userId },
                data: {
                    isActive: true,
                    activatedAt: new Date(),
                    activationIp: geo.ip,
                    activationCity: geo.city,
                    activationCountry: geo.country,
                },
            }),
        ]);

        void this.auditService.log({
            actorId: record.userId,
            action: AuditAction.ACCOUNT_ACTIVATED,
            targetId: record.userId,
            description: `${record.user.email} activated from ${geo.city}, ${geo.country}`,
            ipAddress: ip,
            metadata: { city: geo.city, country: geo.country, ip: geo.ip },
        });

        this.logger.log(
            `Activated: ${record.user.email} from ${geo.city}, ${geo.country}`,
        );

        return {
            message: 'Account activated. Please set your password.',
            token, // pass back so frontend chains to set-password
        };
    }

    // ── Set password (after activation via link) ───────────────────────────────

    async setPassword(dto: SetPasswordDto) {
        const record = await this.prisma.activationToken.findUnique({
            where: { token: dto.token },
            include: {
                user: { select: { id: true, email: true, userId: true } },
            },
        });

        if (!record) throw new BadRequestException('Invalid token');
        if (!record.usedAt) {
            throw new BadRequestException('Activate your account before setting a password');
        }
        if (record.expiresAt < new Date()) {
            throw new BadRequestException('Token expired. Request a new activation link.');
        }

        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

        await this.prisma.user.update({
            where: { id: record.userId },
            data: { passwordHash },
        });

        void this.auditService.log({
            actorId: record.userId,
            action: AuditAction.PASSWORD_SET,
            targetId: record.userId,
            description: `${record.user.email} set their password`,
        });

        return { message: 'Password set. You can now log in.' };
    }

    // ── Private: generate collision-safe userId ────────────────────────────────

    private async generateUniqueUserId(): Promise<string> {
        for (let i = 0; i < 5; i++) {
            const userId = generateUserId();
            const exists = await this.prisma.user.findUnique({
                where: { userId },
                select: { id: true },
            });
            if (!exists) return userId;
        }
        throw new Error('Could not generate unique userId');
    }
}