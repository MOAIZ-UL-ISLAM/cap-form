import { z } from 'zod';

export const updateUserSchema = z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    partnerId: z.string().optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;