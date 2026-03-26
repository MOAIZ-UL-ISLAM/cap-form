import { z } from 'zod';

export const createUserSchema = z.object({
    role: z.enum(['SUPER_ADMIN', 'MANAGER', 'PARTNER', 'CUSTOMER']),
    firstName: z.string().min(1, 'Required').max(50),
    lastName: z.string().min(1, 'Required').max(50),
    email: z.string().email('Invalid email'),
    phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone').optional().or(z.literal('')),
    title: z.enum(['MR', 'MRS', 'MS', 'DR', 'PROF', 'LORD', 'LADY', 'REV']).optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
    country: z.enum(['ENGLAND', 'WALES', 'NORTHERN_IRELAND']).optional(),
    debtRange: z.enum(['LESS_THAN_5000', 'BETWEEN_5000_AND_20000', 'GREATER_THAN_20000']).optional(),
    companyName: z.string().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;