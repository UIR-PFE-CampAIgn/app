export interface Campaign {
    _id: string;
    business_id: string;
    template_id: string;
    name: string;
    schedule_type: 'immediate' | 'scheduled' | 'recurring';
    scheduled_at?: string;
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
    scheduled_at?: string;
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