// apps/api/src/auth/auth.service.ts
import {
    ConflictException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../common/types/jwt-payload.type';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { generateUserId } from './helpers/user-id.helper';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly configService: ConfigService,
    ) { }

    async register(dto: RegisterDto): Promise<{ message: string }> {
        // 1. Check email uniqueness
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
            select: { id: true },
        });

        if (existing) {
            throw new ConflictException('An account with this email already exists');
        }

        // 2. Generate collision-safe userId
        const userId = await this.generateUniqueUserId();

        // 3. Hash password
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

        // 4. Persist user
        const user = await this.prisma.user.create({
            data: {
                userId,
                title: dto.title,
                firstName: dto.firstName.trim(),
                lastName: dto.lastName.trim(),
                gender: dto.gender,
                phone: dto.phone,
                email: dto.email.toLowerCase(),
                country: dto.country,
                debtRange: dto.debtRange,
                passwordHash,
            },
            select: { id: true, userId: true, firstName: true, email: true },
        });

        // 5. Send welcome email (non-blocking)
        void this.mailService.sendWelcomeMail({
            to: user.email,
            firstName: user.firstName,
            userId: user.userId,
            password: dto.password, // plain text — one-time delivery only
        });

        this.logger.log(`New user registered: ${user.userId}`);

        return {
            message:
                'Registration successful. Please check your email for your login credentials.',
        };
    }

    async login(dto: LoginDto): Promise<{ accessToken: string; userId: string }> {
        // 1. Find user by custom userId
        const user = await this.prisma.user.findUnique({
            where: { userId: dto.userId },
            select: {
                id: true,
                userId: true,
                email: true,
                passwordHash: true,
                isActive: true,
            },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 2. Verify password
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 3. Sign JWT
        const payload: JwtPayload = {
            sub: user.id,
            userId: user.userId,
            email: user.email,
        };

        const accessToken = this.jwtService.sign(payload);

        this.logger.log(`User logged in: ${user.userId}`);

        return { accessToken, userId: user.userId };
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    private async generateUniqueUserId(): Promise<string> {
        const MAX_ATTEMPTS = 5;
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            const userId = generateUserId();
            const collision = await this.prisma.user.findUnique({
                where: { userId },
                select: { id: true },
            });
            if (!collision) return userId;
        }
        throw new Error('Failed to generate unique userId after max attempts');
    }
}