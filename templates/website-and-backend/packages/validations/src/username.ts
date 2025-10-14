import { z } from "zod";

const ValidateUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .refine((username) => z.string().min(3).max(16).safeParse(username).success, { message: "Please enter a valid username" })
    .refine((username) => !username.includes(" "), { message: "Username cannot contain spaces" }),
});

export type ValidateUsernameData = z.infer<typeof ValidateUsernameSchema>;

export function validateUsername(data: ValidateUsernameData) {
  const result = ValidateUsernameSchema.safeParse(data);
  if (!result.success) return { success: false, errors: result.error.issues.map((issue) => issue.message) };
  return { success: true, data: result.data };
}
