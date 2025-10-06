export interface Lead {
    id: string;
    provider: string;
    provider_user_id: string;
    display_name?: string; 
    created_at: string; 
  }
  
  export interface GetLeadsParams {
    search?: string;
    provider?: string;
    limit?: number;
  }