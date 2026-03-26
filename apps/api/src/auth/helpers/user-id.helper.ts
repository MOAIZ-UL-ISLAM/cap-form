// src/auth/helpers/user-id.helper.ts
const PREFIX = 'TIGCAP';

export function generateUserId(): string {
    const suffix = Math.floor(1_000_000 + Math.random() * 9_000_000);
    return `${PREFIX}${suffix}`;
}