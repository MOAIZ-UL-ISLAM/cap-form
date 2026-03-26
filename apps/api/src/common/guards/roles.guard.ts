// src/common/guards/roles.guard.ts
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { JwtPayload } from '../types/jwt-payload.type';
import { Role } from 'generated/prisma/client/enums';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!required?.length) return true;

        const { user } = context
            .switchToHttp()
            .getRequest<{ user: JwtPayload }>();

        if (!required.includes(user.role)) {
            throw new ForbiddenException(
                'You do not have permission to access this resource',
            );
        }
        return true;
    }
}