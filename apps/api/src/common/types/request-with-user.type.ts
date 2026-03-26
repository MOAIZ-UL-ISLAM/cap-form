// src/common/types/request-with-user.type.ts
import type { Request } from 'express';
import type { JwtPayload } from './jwt-payload.type';

export interface RequestWithUser extends Request {
    user: JwtPayload;
}