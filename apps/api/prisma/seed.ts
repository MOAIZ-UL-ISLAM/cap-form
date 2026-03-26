// prisma/seed.ts
import 'dotenv/config'; // ← load .env FIRST before anything else
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../generated/prisma/client/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    const hash = await bcrypt.hash('Admin@1234', 12);

    const user = await prisma.user.upsert({
        where: { email: 'admin@theinsolvencygroup.co.uk' },
        update: { passwordHash: hash }, // ← force-update the hash on re-seed
        create: {
            userId: 'TIGCAP1010100',
            email: 'admin@theinsolvencygroup.co.uk',
            passwordHash: hash,
            role: Role.SUPER_ADMIN,
            isActive: true,
            activatedAt: new Date(),
            profile: {
                create: {
                    title: 'MR', // must match enum
                    firstName: 'Super',
                    lastName: 'Admin',
                    email: 'admin@theinsolvencygroup.co.uk',
                    gender: 'MALE',
                    phone: '+447911123456',
                    country: 'ENGLAND',
                    debtRange: 'GREATER_THAN_20000',
                    companyName: null, // optional
                },
            },
        },
    });

    console.log('✓ Super Admin seeded:', user.userId, '/ Admin@1234');
    console.log('✓ Hash stored:', user.passwordHash);
}

main().catch(console.error).finally(() => prisma.$disconnect());