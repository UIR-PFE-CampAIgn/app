// campaigns.api.ts
import { apiClient } from './axios-instance';
import { Campaign, CampaignLog, CreateCampaignDto, CampaignStats, GenerateCampaignRequest, GenerateCampaignResponse, CreateGeneratedCampaignDto } from '@/lib/types/campaign';

export const campaignsApi = {
  async getAll(params: { businessId: string; status?: string }) {
    const response = await apiClient.get<Campaign[]>('/campaigns', { params });
    return response.data;
  },

  async getOne(id: string, businessId: string) {
    const response = await apiClient.get<Campaign>(`/campaigns/${id}`, { params: { businessId } });
    return response.data;
  },

  async create(data: CreateCampaignDto & { businessId: string }) {
    const response = await apiClient.post<Campaign>('/campaigns', data);
    return response.data;
  },

  async getLogs(campaignId: string, businessId: string) {
    const response = await apiClient.get<CampaignLog[]>(`/campaigns/${campaignId}/logs`, { params: { businessId } });
    return response.data;
  },

  async cancel(id: string, businessId: string) {
    const response = await apiClient.delete<{ message: string }>(`/campaigns/${id}`, { params: { businessId } });
    return response.data;
  },

  async getStats(businessId: string) {
    const response = await apiClient.get<CampaignStats>('/campaigns/stats', { params: { businessId } });
    return response.data;
  },
  async generateCampaign(data: GenerateCampaignRequest) {
    const response = await apiClient.post<GenerateCampaignResponse>(
      "campaigns/generate-campaign",
      {
        ...data,
        timezone: data.timezone ?? "UTC",
      }
    );
    return response.data;
  },
  async createGenerated(data: CreateGeneratedCampaignDto & { businessId: string }) {
    const response = await apiClient.post<Campaign>(
      `/campaigns/${data.businessId}/generated`,
      data
    );
    return response.data;
  },
  
};
