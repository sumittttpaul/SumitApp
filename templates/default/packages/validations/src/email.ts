import { z } from "zod";

const ValidateEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .transform((email) => email.toLowerCase())
    .refine((email) => z.email().safeParse(email).success, { message: "Please enter a valid email address" }),
});

export type ValidateEmailData = z.infer<typeof ValidateEmailSchema>;

export function validateEmail(data: ValidateEmailData) {
  const result = ValidateEmailSchema.safeParse(data);
  if (!result.success) return { success: false, errors: result.error.issues.map((issue) => issue.message) };
  return { success: true, data: result.data };
}
