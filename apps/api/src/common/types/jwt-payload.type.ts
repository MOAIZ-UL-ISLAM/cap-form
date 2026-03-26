// src/common/types/jwt-payload.type.ts

import { Role } from "generated/prisma/client/enums";

export interface JwtPayload {
    sub: string;
    userId: string;
    email: string;
    role: Role;
}