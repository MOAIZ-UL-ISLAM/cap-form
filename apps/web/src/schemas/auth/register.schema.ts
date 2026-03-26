import { z } from "zod";

const strongPassword = z
    .string()
    .min(8, "Min 8 characters")
    .max(64)
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Must include uppercase, lowercase, number and special character"
    );

export const registerSchema = z
    .object({
        title: z.enum(["MR", "MRS", "MS", "DR", "PROF", "LORD", "LADY", "REV"], {
            error: (iss) => (iss.input === undefined ? "Select a title" : undefined),
        }),
        firstName: z.string().min(1, "Required").max(50),
        lastName: z.string().min(1, "Required").max(50),
        gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
            error: (iss) => (iss.input === undefined ? "Select a gender" : undefined),
        }),
        phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number"),
        email: z.string().email("Invalid email"),
        country: z.enum(["ENGLAND", "WALES", "NORTHERN_IRELAND"], {
            error: (iss) => (iss.input === undefined ? "Select a country" : undefined),
        }),
        debtRange: z.enum(
            ["LESS_THAN_5000", "BETWEEN_5000_AND_20000", "GREATER_THAN_20000"],
            {
                error: (iss) => (iss.input === undefined ? "Select debt range" : undefined),
            }
        ),
        password: strongPassword,
        confirmPassword: z.string().min(1, "Required"),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;