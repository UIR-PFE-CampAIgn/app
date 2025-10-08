import { apiClient } from './axios-instance';
import { Chat, Message, SendMessageDto, GetChatsParams, ChatsResponse } from '@/lib/types/chat';

export const chatsApi = {
  async getAll(params?: GetChatsParams): Promise<ChatsResponse> {
    const searchParams: Record<string, string> = {};
    
    if (params?.businessId) searchParams.businessId = params.businessId;
    if (params?.status) searchParams.status = params.status;
    if (params?.page) searchParams.page = params.page.toString();
    if (params?.limit) searchParams.limit = params.limit.toString();
    if (params?.search) searchParams.search = params.search;

    const response = await apiClient.get<ChatsResponse>('/chats', {
      params: searchParams,
    });
    
    return response.data;
  },

  async getById(id: string): Promise<Chat> {
    const response = await apiClient.get<Chat>(`/chats/${id}`);
    return response.data;
  },

  async getMessages(chatId: string, limit?: number): Promise<Message[]> {
    const params = limit ? { limit: limit.toString() } : {};
    const response = await apiClient.get<Message[]>(`/chats/${chatId}/messages`, {
      params,
    });
    return response.data;
  },

  async sendMessage(chatId: string, data: SendMessageDto): Promise<Message> {
    const response = await apiClient.post<Message>(`/chats/${chatId}/messages`, data);
    return response.data;
  },

  async updateStatus(chatId: string, status: string): Promise<void> {
    await apiClient.patch(`/chats/${chatId}/status`, { status });
  },
};
