// lib/validators/product.validator.ts

import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name is too long"),
  
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0")
    .max(999999, "Price is too high"),
  
  currency: z
    .string()
    .optional()
    .default("USD"),
  
  description: z
    .string()
    .max(500, "Description is too long")
    .optional(),
  
  sku: z
    .string()
    .max(50, "SKU is too long")
    .optional(),
  
  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .optional()
    .default(0),
  
  category: z
    .string()
    .max(50, "Category name is too long")
    .optional(),
  

});

export type ProductFormValues = z.infer<typeof productFormSchema>;