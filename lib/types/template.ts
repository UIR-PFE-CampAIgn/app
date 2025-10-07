export interface MessageTemplate {
    id: string;
    business_id: string;
    name: string;
    content: string;
    category: 'onboarding' | 'transactional' | 'follow-up' | 'promotional' | 'general';
    language: string;
    variables: string[];
    usage_count: number;
    last_used_at: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreateTemplateDto {
    name: string;
    content: string;
    category: 'onboarding' | 'transactional' | 'follow-up' | 'promotional' | 'general';
    language?: string;
  }
  
  export interface UpdateTemplateDto {
    name?: string;
    content?: string;
    category?: 'onboarding' | 'transactional' | 'follow-up' | 'promotional' | 'general';
    language?: string;
  }