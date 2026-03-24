// apps/api/src/common/types/jwt-payload.type.ts
export interface JwtPayload {
    sub: string;       // internal UUID
    userId: string;    // TIGCAP...
    email: string;
}