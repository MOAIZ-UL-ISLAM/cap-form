// src/audit/audit.types.ts
import type { Prisma } from '../../generated/prisma/client/client';

// Strongly-typed params for AuditService.log()
// Uses Prisma's UncheckedCreateInput so we only deal with scalars.
export type AuditLogParams = Pick<
    Prisma.AuditLogUncheckedCreateInput,
    | 'action'
    | 'actorId'
    | 'targetId'
    | 'description'
    | 'metadata'
    | 'ipAddress'
    | 'userAgent'
>;