export interface Chat {
    _id: string;
    lead_id: string;
    lead_name?: string;
    lead_phone?: string;
    business_social_media_id: string;
    status: 'open' | 'closed' | 'archived';
    running_summary?: string;
    last_inbound_at?: string;
    last_outbound_at?: string;
    message_count: number;
    unread_count?: number;
    last_message?: {
      text?: string;
      direction: 'inbound' | 'outbound';
      msg_type: string;
      created_at: string;
    };
    created_at: string;
    updated_at: string;
  }
  
  export interface Message {
    _id: string;
    chat_id: string;
    direction: 'inbound' | 'outbound';
    msg_type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'sticker' | 'location' | 'contacts' | 'button';
    text?: string;
    payload?: Record<string, unknown>;
    provider_message_id?: string;
    ai_reply: boolean;
    ai_model?: string;
    ai_confidence?: number;
    campaign_id?: string;
    created_at: string;
  }
  
  export interface SendMessageDto {
    text: string;
    msg_type?: string;
  }
  
  export interface GetChatsParams {
    businessId?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }
  
  export interface ChatsResponse {
    chats: Chat[];
    total: number;
    page: number;
    limit: number;
  }