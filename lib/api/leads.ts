import { apiClient } from './axios-instance';
import { Lead, GetLeadsParams } from '@/lib/types/lead';

export const leadsApi = {
  async getAll(params?: GetLeadsParams): Promise<Lead[]> {
    const response = await apiClient.get<Lead[]>('/leads', { params });
    return response.data;
  },

  async getOne(id: string): Promise<Lead> {
    const response = await apiClient.get<Lead>(`/leads/${id}`);
    return response.data;
  },
};