// src/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuditLogParams } from './audit.types';


@Injectable()
export class AuditService {
    constructor(private readonly prisma: PrismaService) { }

    async log(params: AuditLogParams): Promise<void> {
        await this.prisma.auditLog.create({ data: params });
    }

    async getAll(limit = 500) {
        return this.prisma.auditLog.findMany({
            include: {
                actor: { select: { userId: true, email: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}