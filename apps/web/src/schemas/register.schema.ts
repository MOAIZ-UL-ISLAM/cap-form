// apps/web/src/schemas/register.schema.ts
import { z } from 'zod';

export const registerSchema = z
    .object({
        title: z.enum(['MR', 'MRS', 'MS', 'DR', 'PROF', 'LORD', 'LADY', 'REV'], {
            required_error: 'Please select a title',
        }),
        firstName: z
            .string()
            .min(1, 'First name is required')
            .max(50, 'First name too long'),
        lastName: z
            .string()
            .min(1, 'Last name is required')
            .max(50, 'Last name too long'),
        gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], {
            required_error: 'Please select a gender',
        }),
        phone: z
            .string()
            .regex(/^\+?[1-9]\d{7,14}$/, 'Enter a valid phone number (e.g. +447911123456)'),
        email: z.string().email('Enter a valid email address'),
        country: z.enum(['ENGLAND', 'WALES', 'NORTHERN_IRELAND'], {
            required_error: 'Please select a country',
        }),
        debtRange: z.enum(
            ['LESS_THAN_5000', 'BETWEEN_5000_AND_20000', 'GREATER_THAN_20000'],
            { required_error: 'Please select your debt range' },
        ),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(64, 'Password too long')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                'Must contain uppercase, lowercase, number and special character',
            ),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;