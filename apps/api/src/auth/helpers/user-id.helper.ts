// apps/api/src/auth/helpers/user-id.helper.ts

const PREFIX = 'TIGCAP';
const MIN_SUFFIX = 1000000;
const MAX_SUFFIX = 9999999;

export function generateUserId(): string {
    const suffix =
        Math.floor(Math.random() * (MAX_SUFFIX - MIN_SUFFIX + 1)) + MIN_SUFFIX;
    return `${PREFIX}${suffix}`;
}