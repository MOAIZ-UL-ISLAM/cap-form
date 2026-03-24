// apps/web/src/types/auth.types.ts
export type Title = 'MR' | 'MRS' | 'MS' | 'DR' | 'PROF' | 'LORD' | 'LADY' | 'REV';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type Country = 'ENGLAND' | 'WALES' | 'NORTHERN_IRELAND';
export type DebtRange =
    | 'LESS_THAN_5000'
    | 'BETWEEN_5000_AND_20000'
    | 'GREATER_THAN_20000';

export interface RegisterPayload {
    title: Title;
    firstName: string;
    lastName: string;
    gender: Gender;
    phone: string;
    email: string;
    country: Country;
    debtRange: DebtRange;
    password: string;
    confirmPassword: string;
}

export interface LoginPayload {
    userId: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    userId: string;
}

export interface AuthUser {
    userId: string;
    accessToken: string;
}