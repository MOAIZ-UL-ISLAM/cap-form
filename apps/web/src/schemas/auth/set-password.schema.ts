import { z } from 'zod';

const strongPassword = z
    .string()
    .min(8, 'Min 8 characters').max(64)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Must include uppercase, lowercase, number and special character');

export const setPasswordSchema = z
    .object({
        password: strongPassword,
        confirmPassword: z.string().min(1, 'Required'),
    })
    .refine(d => d.password === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;