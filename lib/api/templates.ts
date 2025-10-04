import { apiClient } from './axios-instance';
import { MessageTemplate, CreateTemplateDto, UpdateTemplateDto } from '@/lib/types/template';

export const templatesApi = {
  async getAll(params?: { category?: string; search?: string }): Promise<MessageTemplate[]> {
    const searchParams: Record<string, string> = {};
    
    if (params?.category && params.category !== 'all') {
      searchParams.category = params.category;
    }
    if (params?.search) {
      searchParams.search = params.search;
    }

    const response = await apiClient.get<MessageTemplate[]>('/message-templates', {
      params: searchParams,
    });
    
    return response.data;
  },

  async create(data: CreateTemplateDto): Promise<MessageTemplate> {
    const response = await apiClient.post<MessageTemplate>('/message-templates', data);
    return response.data;
  },

  async update(id: string, data: UpdateTemplateDto): Promise<MessageTemplate> {
    const response = await apiClient.put<MessageTemplate>(`/message-templates/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/message-templates/${id}`);
  },

  async duplicate(id: string): Promise<MessageTemplate> {
    const response = await apiClient.post<MessageTemplate>(`/message-templates/${id}/duplicate`);
    return response.data;
  },
};