// apps/web/src/schemas/login.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
    userId: z
        .string()
        .regex(/^TIGCAP\d{7}$/, 'Invalid User ID format (e.g. TIGCAP1234567)'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;