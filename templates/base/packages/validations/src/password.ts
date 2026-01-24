import zxcvbn from "zxcvbn";
import { z } from "zod";

const ValidatePasswordSchema = z.object({
  password: z
    .string()
    .min(12, { message: "Password must be at least 12 characters long" })
    .max(20, { message: "Password cannot exceed 20 characters" })
    .refine((password) => /[a-z]/.test(password), { message: "Must contain at least one lowercase letter" })
    .refine((password) => /[A-Z]/.test(password), { message: "Must contain at least one uppercase letter" })
    .refine((password) => /[0-9]/.test(password), { message: "Must contain at least one number" })
    .refine((password) => /[^a-zA-Z0-9]/.test(password), { message: "Must contain at least one special character" })
    .refine((password) => zxcvbn(password).score >= 3, { message: "Password is too weak or too common" }),
});

export type ValidatePasswordData = z.infer<typeof ValidatePasswordSchema>;

export function validatePassword(data: ValidatePasswordData) {
  const result = ValidatePasswordSchema.safeParse(data);
  if (!result.success) return { success: false, errors: result.error.issues.map((issue) => issue.message) };
  return { success: true, data: result.data };
}
