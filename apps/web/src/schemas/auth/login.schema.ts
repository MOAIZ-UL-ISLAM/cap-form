import { z } from 'zod';

export const loginSchema = z.object({
    userId: z.string().min(1, 'User ID is required')
        .regex(/^TIGCAP\d{7}$/, 'Format: TIGCAP1234567'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;