// lib/types/business.ts

import { MessageTemplate } from "./template";

// Campaign interface matching your API response
export interface Campaign {
  _id: string;
  business_id: string;
  template_id: string;
  name: string;
  schedule_type: 'immediate' | 'scheduled' | 'recurring';
  scheduled_at?: Date;
  cron_expression?: string;
  target_leads: ('hot' | 'warm' | 'cold')[];
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed';
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  created_at: Date;
  updated_at: Date;
}

// Message Template interface matching your API response
export interface MessageTemplateResponse {
  id: string;
  business_id: string;
  name: string;
  content: string;
  category: "onboarding" | "general" | "transactional" | "follow-up" | "promotional" | "welcome"; // ✅ Changed from string
  language: string;
  variables: string[];
  usage_count: number;
  last_used_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Business interface matching your API response
export interface Business {
  _id: string;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone: string;
  logo_url?: string;
  is_active: boolean;
  user_id: string;
  campaigns?: number; // Campaign count
  Leads?: number; // Lead count
  recentCampaigns?: Campaign[]; // Recent campaigns array
  welcomeTemplate?: MessageTemplate | null; // Welcome template
  created_at: Date;
  updated_at: Date;
}



export type BusinessStatus = 'active' | 'inactive' | 'pending';