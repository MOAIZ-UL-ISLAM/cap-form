// src/forms/customer-start/customer-start.service.ts
import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuditAction, Role } from '../../../generated/prisma/client/enums';
import { AuditService } from '../../audit/audit.service';
import { GeoService } from '../../geo/geo.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import type { CreateCustomerStartDto } from './dto/create-customer-start.dto';
import { UpdateCustomerStartDto } from './dto/update-customer-start.dto';
import { FormAccessHelper } from './helpers/form-access.helper';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

// Reusable select for loading a form with ownership info
const FORM_WITH_OWNER = {
    id: true,
    customerId: true,
    debtAdviceFor: true,
    hadPreviousDebtSolution: true,
    hadBreathingSpace: true,
    mainReason: true,
    debtCause: true,
    hasPersonalBarriers: true,
    personalBarriersDetail: true,
    country: true,
    residentialStatus: true,
    hadBailiffContact: true,
    isSubmitted: true,
    submittedAt: true,
    createdAt: true,
    updatedAt: true,
    customer: {
        select: {
            userId: true,
            email: true,
            partnerId: true,
            profile: {
                select: { firstName: true, lastName: true },
            },
        },
    },
} as const;

@Injectable()
export class CustomerStartService {
    private readonly logger = new Logger(CustomerStartService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly auditService: AuditService,
        private readonly geoService: GeoService,
    ) { }

    // ── Create ─────────────────────────────────────────────────────────────────

    async create(
        actor: JwtPayload,
        targetCustomerUserId: string,
        dto: CreateCustomerStartDto,
    ) {
        // Resolve the customer's internal ID
        const customer = await this.resolveCustomer(targetCustomerUserId);

        // Check the actor is allowed to create a form for this customer
        this.assertCanActOnCustomer(actor, customer);

        // One form per customer
        const existing = await this.prisma.customerStart.findUnique({
            where: { customerId: customer.id },
            select: { id: true },
        });
        if (existing) {
            throw new ConflictException(
                'A start form already exists for this customer. Use PATCH to update it.',
            );
        }

        const form = await this.prisma.customerStart.create({
            data: {
                customerId: customer.id,
                ...dto,
            },
            select: FORM_WITH_OWNER,
        });

        void this.auditService.log({
            actorId: actor.sub,
            action: AuditAction.CUSTOMER_START_CREATED,
            targetId: form.id,
            description: `${actor.role} ${actor.userId} created start form for customer ${targetCustomerUserId}`,
            metadata: { formId: form.id },
        });

        this.logger.log(`Start form created for ${targetCustomerUserId} by ${actor.userId}`);
        return form;
    }

    // ── Get one (by customer userId) ───────────────────────────────────────────

    async findByCustomer(actor: JwtPayload, targetCustomerUserId: string) {
        const form = await this.prisma.customerStart.findFirst({
            where: { customer: { userId: targetCustomerUserId } },
            select: FORM_WITH_OWNER,
        });

        if (!form) throw new NotFoundException('No start form found for this customer');

        FormAccessHelper.assertCanRead(actor, form);
        return form;
    }

    // ── List all (admin/manager only — scoped for partner) ────────────────────

    async findAll(actor: JwtPayload) {
        const where =
            actor.role === Role.PARTNER
                ? { customer: { partnerId: actor.sub } }
                : {};

        return this.prisma.customerStart.findMany({
            where,
            select: FORM_WITH_OWNER,
            orderBy: { createdAt: 'desc' },
        });
    }

    // ── Update ─────────────────────────────────────────────────────────────────

    async update(
        actor: JwtPayload,
        targetCustomerUserId: string,
        dto: UpdateCustomerStartDto,
    ) {
        const form = await this.getFormOrThrow(targetCustomerUserId);
        FormAccessHelper.assertCanWrite(actor, form);

        // Track field-level changes for audit
        const changes = this.diffForm(form, { ...dto });


        const updated = await this.prisma.customerStart.update({
            where: { id: form.id },
            data: dto,
            select: FORM_WITH_OWNER,
        });

        void this.auditService.log({
            actorId: actor.sub,
            action: AuditAction.CUSTOMER_START_UPDATED,
            targetId: form.id,
            description: `${actor.role} ${actor.userId} updated start form for ${targetCustomerUserId}`,
            metadata: JSON.parse(JSON.stringify({ changes }))
        });

        return updated;
    }

    // ── Submit ─────────────────────────────────────────────────────────────────

    async submit(
        actor: JwtPayload,
        targetCustomerUserId: string,
        req: Request,
    ) {
        const form = await this.getFormOrThrow(targetCustomerUserId);
        FormAccessHelper.assertCanSubmit(actor, form);

        const ip = this.geoService.extractIp(req);

        const submitted = await this.prisma.customerStart.update({
            where: { id: form.id },
            data: {
                isSubmitted: true,
                submittedAt: new Date(),
                submittedIp: ip,
            },
            select: FORM_WITH_OWNER,
        });

        void this.auditService.log({
            actorId: actor.sub,
            action: AuditAction.CUSTOMER_START_SUBMITTED,
            targetId: form.id,
            description: `${actor.role} ${actor.userId} submitted start form for ${targetCustomerUserId}`,
            ipAddress: ip,
            metadata: { submittedAt: submitted.submittedAt },
        });

        this.logger.log(`Start form submitted for ${targetCustomerUserId}`);
        return submitted;
    }

    // ── Delete (SuperAdmin only) ───────────────────────────────────────────────

    async remove(actor: JwtPayload, targetCustomerUserId: string) {
        const form = await this.getFormOrThrow(targetCustomerUserId);

        await this.prisma.customerStart.delete({ where: { id: form.id } });

        void this.auditService.log({
            actorId: actor.sub,
            action: AuditAction.CUSTOMER_START_UPDATED, // closest available
            targetId: form.id,
            description: `SuperAdmin ${actor.userId} deleted start form for ${targetCustomerUserId}`,
        });

        return { message: 'Form deleted' };
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private async resolveCustomer(customerUserId: string) {
        const customer = await this.prisma.user.findUnique({
            where: { userId: customerUserId },
            select: { id: true, userId: true, role: true, partnerId: true },
        });

        if (!customer) throw new NotFoundException('Customer not found');
        return customer;
    }

    private async getFormOrThrow(customerUserId: string) {
        const form = await this.prisma.customerStart.findFirst({
            where: { customer: { userId: customerUserId } },
            select: {
                ...FORM_WITH_OWNER,
                customer: {
                    select: {
                        id: true,
                        userId: true,
                        email: true,
                        partnerId: true,
                        profile: { select: { firstName: true, lastName: true } },
                    },
                },
            },
        });

        if (!form) throw new NotFoundException('No start form found for this customer');
        return form;
    }

    /**
     * Asserts the actor (creator) is allowed to create/act on this customer's form.
     * Separate from FormAccessHelper because this runs before the form exists.
     */
    private assertCanActOnCustomer(
        actor: JwtPayload,
        customer: { id: string; role: string; partnerId: string | null },
    ): void {
        if (
            actor.role === Role.SUPER_ADMIN ||
            actor.role === Role.MANAGER
        ) return;

        if (actor.role === Role.PARTNER) {
            if (customer.partnerId !== actor.sub) {
                throw new NotFoundException('Customer not found');
                // Use NotFoundException not Forbidden — don't reveal existence
            }
            return;
        }

        // CUSTOMER — can only create their own form
        if (customer.id !== actor.sub) {
            throw new NotFoundException('Customer not found');
        }
    }

    private diffForm(
        current: Record<string, unknown>,
        incoming: Record<string, unknown>,
    ): Record<string, { before: unknown; after: unknown }> {
        const changes: Record<string, { before: unknown; after: unknown }> = {};
        for (const key of Object.keys(incoming)) {
            if (
                incoming[key] !== undefined &&
                current[key] !== incoming[key]
            ) {
                changes[key] = { before: current[key], after: incoming[key] };
            }
        }
        return changes;
    }
}