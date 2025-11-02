// lib/validators/template.validator.ts
import * as z from "zod";
import { templateService } from "../services/template.service";
import { ALLOWED_VARIABLE_KEYS } from "../constants/template-variables";

export const createTemplateSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name too long")
    .transform(val => val.trim()),
  
    content: z.string()
    .min(1, "Content is required")
    .transform(val => val.trim()),
  
  category: z.enum([
    "onboarding",
    "transactional", 
    "follow-up",
    "promotional",
    "general"
  ]),
  
  language: z.string()
    .length(2, "Language code must be 2 characters")
    .toUpperCase(),
  template_key: z.string().optional()

});

export const updateTemplateSchema = createTemplateSchema.partial();

export const templateQuerySchema = z.object({
  search: z.string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val.length > 0,
      { message: "Search term cannot be empty or whitespace" }
    ),
  
  category: z.enum([
    "onboarding",
    "transactional",
    "follow-up", 
    "promotional",
    "general"
  ]).optional(),
});
export const templateFormSchema = z.object({
    name: z.string().min(1, "Template name is required").max(100, "Name too long"),
    content: z.string()
      .min(1, "Content is required")
      .refine(
        (content) => {
          const variables = templateService.extractVariables(content);
          const invalidVars = variables.filter(
            v => !ALLOWED_VARIABLE_KEYS.includes(v as (typeof ALLOWED_VARIABLE_KEYS)[number])
          );          
          return invalidVars.length === 0;
        },
        (content) => {
          const variables = templateService.extractVariables(content);
          const invalidVars = variables.filter(
            v => !ALLOWED_VARIABLE_KEYS.includes(v as (typeof ALLOWED_VARIABLE_KEYS)[number])
          );
          return {
            message: `Invalid variables: ${invalidVars.join(', ')}. Allowed: ${ALLOWED_VARIABLE_KEYS.join(', ')}`
          };
        }
      ),
    category: z.enum(["onboarding", "transactional", "follow-up", "promotional", "general"]),
    language: z.string().min(2, "Language is required"),
  });
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type TemplateQueryParams = z.infer<typeof templateQuerySchema>;
export type templateFormSchema = z.infer<typeof templateFormSchema>;
