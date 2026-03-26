// src/prisma/prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL!,
        });
        super({ adapter }); // ← must match seed.ts exactly
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Database connected');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}