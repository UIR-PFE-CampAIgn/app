import * as z from "zod";

export const createCampaignSchema = z.object({
  name: z.string()
    .min(3, "Campaign name must be at least 3 characters")
    .max(100, "Campaign name too long")
    .transform(val => val.trim()),
    
  template_id: z.string()
    .min(1, "Template is required"),
    
  schedule_type: z.enum(["immediate", "scheduled", "recurring"], {
    errorMap: () => ({ message: "Invalid schedule type" })
  }),
    
  scheduled_at: z.string()
    .datetime("Invalid date format")
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return date > new Date();
      },
      { message: "Scheduled date must be in the future" }
    ),
    
  cron_expression: z.string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // Basic cron validation (5 parts)
        const parts = val.split(' ');
        return parts.length === 5;
      },
      { message: "Invalid cron expression format" }
    ),
    
  target_leads: z.array(z.enum(["hot", "warm", "cold"]))
    .min(1, "At least one score type is required")
    .max(3, "Maximum 3 score types per campaign"),
    
  lead_data: z.array(z.record(z.any()))
    .optional(),
}).refine(
  (data) => {
    // If scheduled, must have scheduled_at
    if (data.schedule_type === "scheduled" && !data.scheduled_at) {
      return false;
    }
    return true;
  },
  {
    message: "Scheduled campaigns must have a scheduled date",
    path: ["scheduled_at"]
  }
).refine(
  (data) => {
    // If recurring, must have cron_expression
    if (data.schedule_type === "recurring" && !data.cron_expression) {
      return false;
    }
    return true;
  },
  {
    message: "Recurring campaigns must have a cron expression",
    path: ["cron_expression"]
  }
);

export const campaignQuerySchema = z.object({
  status: z.enum([
    "all",
    "draft",
    "scheduled",
    "running",
    "completed",
    "failed"
  ]).optional(),
  
  search: z.string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val.length > 0,
      { message: "Search term cannot be empty or whitespace" }
    ),
});

export const campaignFormSchema = z.object({
  name: z.string()
    .min(3, "Campaign name must be at least 3 characters")
    .max(100, "Campaign name too long"),
    
  template_id: z.string()
    .min(1, "Please select a template"),
    
  schedule_type: z.enum(["immediate", "scheduled", "recurring"]),
    
  scheduled_date: z.string().optional(),
  scheduled_time: z.string().optional(),
    
  target_leads: z.array(z.enum(["hot", "warm", "cold"]))
    .min(1, "Please select at least one score type"),
}).refine(
  (data) => {
    if (data.schedule_type === "scheduled") {
      return data.scheduled_date && data.scheduled_time;
    }
    return true;
  },
  {
    message: "Please select both date and time for scheduled campaigns",
    path: ["scheduled_date"]
  }
);
export const campaignSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  template_id: z.string(),
  name: z.string(),
  schedule_type: z.enum(["immediate", "scheduled", "recurring"]),
  scheduled_at: z.string().optional(),
  cron_expression: z.string().optional(),
  target_leads: z.array(z.enum(["hot", "warm", "cold"])),
  status: z.enum(["draft", "scheduled", "running", "completed", "failed"]),
  total_recipients: z.coerce.number().default(0),
  sent_count: z.coerce.number().default(0),
  failed_count: z.coerce.number().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});

// Type exports
export const campaignsListSchema = z.array(campaignSchema);
export type Campaign = z.infer<typeof campaignSchema>;
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type CampaignQueryParams = z.infer<typeof campaignQuerySchema>;
export type CampaignFormInput = z.infer<typeof campaignFormSchema>;