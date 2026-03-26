export type Role = 'SUPER_ADMIN' | 'MANAGER' | 'PARTNER' | 'CUSTOMER';
export type Title = 'MR' | 'MRS' | 'MS' | 'DR' | 'PROF' | 'LORD' | 'LADY' | 'REV';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type Country = 'ENGLAND' | 'WALES' | 'NORTHERN_IRELAND';
export type DebtRange = 'LESS_THAN_5000' | 'BETWEEN_5000_AND_20000' | 'GREATER_THAN_20000';

export interface UserProfile {
    firstName: string;
    lastName: string;
    phone?: string;
    companyName?: string;
}

export interface User {
    id: string;
    userId: string;
    email: string;
    role: Role;
    isActive: boolean;
    createdAt: string;
    profile: UserProfile | null;
    partner?: {
        userId: string;
        email: string;
        profile?: { firstName: string; lastName: string };
    } | null;
    createdBy?: {
        userId: string;
        email: string;
        role: Role;
    } | null;
}

export const ROLE_LABELS: Record<Role, string> = {
    SUPER_ADMIN: 'Super Admin',
    MANAGER: 'Manager',
    PARTNER: 'Partner',
    CUSTOMER: 'Customer',
};

export const TITLES: Title[] = ['MR', 'MRS', 'MS', 'DR', 'PROF', 'LORD', 'LADY', 'REV'];
export const GENDERS: { value: Gender; label: string }[] = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];
export const COUNTRIES: { value: Country; label: string }[] = [
    { value: 'ENGLAND', label: 'England' },
    { value: 'WALES', label: 'Wales' },
    { value: 'NORTHERN_IRELAND', label: 'Northern Ireland' },
];
export const DEBT_RANGES: { value: DebtRange; label: string }[] = [
    { value: 'LESS_THAN_5000', label: 'Less than £5,000' },
    { value: 'BETWEEN_5000_AND_20000', label: '£5,000 – £20,000' },
    { value: 'GREATER_THAN_20000', label: 'Greater than £20,000' },
];