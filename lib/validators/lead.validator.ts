import * as z from "zod";

export const leadResponseSchema = z.object({
  id: z.string().uuid("Invalid lead ID"),
  provider: z.string().min(1, "Provider is required"),
  provider_user_id: z.string().min(1, "Provider user ID is required"),
  display_name: z.string().optional(),
  created_at: z.string().datetime("Invalid date format"),
});

export const leadQuerySchema = z.object({
  search: z.string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val.length > 0,
      { message: "Search term cannot be empty or whitespace" }
    ),
  provider: z.string().optional(),
  limit: z.number().min(1).max(1000).optional(),
});

// Array validator for multiple leads
export const leadsArraySchema = z.array(leadResponseSchema);

// Type exports
export type LeadResponse = z.infer<typeof leadResponseSchema>;
export type LeadQueryParams = z.infer<typeof leadQuerySchema>;