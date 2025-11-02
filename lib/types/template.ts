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
    template_key?:string;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreateTemplateDto {
    name: string;
    business_id: string;
    content: string;
    category: 'onboarding' | 'transactional' | 'follow-up' | 'promotional' | 'general';
    language?: string;
    template_key?:string;

  }
  
  export interface UpdateTemplateDto {
    name?: string;
    content?: string;
    category?: 'onboarding' | 'transactional' | 'follow-up' | 'promotional' | 'general';
    language?: string;

  }