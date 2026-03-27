// src/forms/customer-start/helpers/form-access.helper.ts
// Centralises all "who can see/touch this form" logic.
// Called from service — keeps the service clean.
import { ForbiddenException } from '@nestjs/common';
import { Role } from '../../../../generated/prisma/client/enums';
import type { JwtPayload } from '../../../common/types/jwt-payload.type';

interface FormOwnership {
    customerId: string;
    customer: {
        partnerId: string | null;
    };
    isSubmitted: boolean;
}

export class FormAccessHelper {
    /**
     * READ access rules:
     * - SUPER_ADMIN / MANAGER → always
     * - PARTNER → only if they created/own this customer AND form not submitted
     * - CUSTOMER → only their own form
     */
    static assertCanRead(actor: JwtPayload, form: FormOwnership): void {
        if (
            actor.role === Role.SUPER_ADMIN ||
            actor.role === Role.MANAGER
        ) return;

        if (actor.role === Role.PARTNER) {
            if (form.isSubmitted) {
                throw new ForbiddenException(
                    'This form has been submitted and is no longer accessible to partners',
                );
            }
            if (form.customer.partnerId !== actor.sub) {
                throw new ForbiddenException('You do not have access to this form');
            }
            return;
        }

        // CUSTOMER — own form only
        if (form.customerId !== actor.sub) {
            throw new ForbiddenException('You do not have access to this form');
        }
    }

    /**
     * WRITE access rules:
     * - SUPER_ADMIN / MANAGER → always (even after submission, for corrections)
     * - PARTNER → only if they own the customer AND not yet submitted
     * - CUSTOMER → only their own, only if not yet submitted
     */
    static assertCanWrite(actor: JwtPayload, form: FormOwnership): void {
        if (
            actor.role === Role.SUPER_ADMIN ||
            actor.role === Role.MANAGER
        ) return;

        if (form.isSubmitted) {
            throw new ForbiddenException(
                'This form has already been submitted and cannot be edited',
            );
        }

        if (actor.role === Role.PARTNER) {
            if (form.customer.partnerId !== actor.sub) {
                throw new ForbiddenException('You do not have access to this form');
            }
            return;
        }

        if (form.customerId !== actor.sub) {
            throw new ForbiddenException('You do not have access to this form');
        }
    }

    /**
     * SUBMIT access:
     * - SUPER_ADMIN / MANAGER / PARTNER (if owner) / CUSTOMER (if owner)
     * - Cannot submit if already submitted
     */
    static assertCanSubmit(actor: JwtPayload, form: FormOwnership): void {
        if (form.isSubmitted) {
            throw new ForbiddenException('Form already submitted');
        }
        // Same write rules for submit
        FormAccessHelper.assertCanWrite(actor, form);
    }
}