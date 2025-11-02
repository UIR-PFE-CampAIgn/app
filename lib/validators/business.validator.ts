// lib/validators/business.validator.ts
import * as z from "zod";

export const businessFormSchema = z.object({
  name: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  
  industry: z
    .string()
    .min(1, "Industry is required"),
  
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .trim(),
  
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal(""))
    .transform(val => val === "" ? undefined : val),
  
  phone: z
    .string()
    .optional()
    .transform(val => val === "" ? undefined : val),
  
  website: z
    .string()
    .url("Invalid URL format")
    .optional()
    .or(z.literal(""))
    .transform(val => val === "" ? undefined : val),
  
  address: z
    .string()
    .optional()
    .transform(val => val === "" ? undefined : val),
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;

export const defaultBusinessFormValues: BusinessFormValues = {
  name: "",
  industry: "",
  description: "",
  email: "",
  phone: "",
  website: "",
  address: "",
};