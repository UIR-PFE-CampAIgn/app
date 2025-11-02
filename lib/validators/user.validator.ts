import * as z from 'zod';

// Profile form schema
export const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

// Password form schema (no current password)
export const passwordFormSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type inference for React Hook Form
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type PasswordFormValues = z.infer<typeof passwordFormSchema>;
