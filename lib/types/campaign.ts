export interface Campaign {
    _id: string;
    business_id: string;
    template_id: string;
    name: string;
    schedule_type: 'immediate' | 'scheduled' | 'recurring';
    scheduled_at?: string; // UTC ISO string from backend
    cron_expression?: string;
    target_leads: string[];
    status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed';
    total_recipients: number;
    sent_count: number;
    failed_count: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface CampaignLog {
    _id: string;
    campaign_id: string;
    lead_id: string;
    chat_id: string;
    message_id?: string;
    message_content: string;
    status: 'pending' | 'sent' | 'failed';
    error_message?: string;
    created_at: string;
  }
  
  export interface CreateCampaignDto {
    template_id: string;
    name: string;
    schedule_type: 'immediate' | 'scheduled' | 'recurring';
    scheduled_at?: string | Date; // Can accept both from form
    cron_expression?: string;
    target_leads: string[];
    lead_data?: Record<string, never>[];
  }
  
  export interface CampaignStats {
    total_campaigns: number;
    active_campaigns: number;
    total_sent: number;
    success_rate: number;
  }


  // Campaign generator types
export interface CampaignStrategy {
  target_segments: string[];
  reasoning: string;
  campaign_type: string;
  key_message: string;
  expected_response_rates: Record<string, string>;
}

export interface MessageTemplate {
  message: string;
  target_segment: string;
  template_type: string;
  approach: string;
  personalization_tips: string;
}

export interface SendSchedule {
  segment: string;
  send_datetime: string;
  reasoning: string;
  priority: string;
}

export interface CampaignInsights {
  success_factors: string[];
  warnings: string[];
  optimization_tips: string[];
}

export interface CampaignResponse {
  strategy: CampaignStrategy;
  templates: MessageTemplate[];
  schedule: SendSchedule[];
  insights: CampaignInsights;
}

export interface GenerateCampaignRequest {
  prompt: string;
  businessId: string;
  timezone?: string;
}

export interface GenerateCampaignResponse {
  campaign: CampaignResponse;
  note: string;
}

export interface CreateGeneratedCampaignDto {
  name: string; // campaign name chosen by user
  message_content: string; // template message (AI-generated, editable)
  template_type: string;
  schedule_type: 'immediate' | 'scheduled' | 'recurring';
  scheduled_at?: string | Date;
  cron_expression?: string;
  target_leads: ('hot' | 'warm' | 'cold')[];
  lead_data?: Record<string, never>[];
}

