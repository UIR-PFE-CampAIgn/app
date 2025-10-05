import { apiClient } from './axios-instance';
import { Campaign, CampaignLog, CreateCampaignDto, CampaignStats } from '@/lib/types/campaign';

// Helper to get businessId (you should implement this based on your auth)
const getBusinessId = (): string => {
  // TODO: Get from authenticated user context
  // For now, return a default or get from localStorage
  return 'default-business'; // Replace with actual logic
};

export const campaignsApi = {
  async getAll(params?: { status?: string }): Promise<Campaign[]> {
    const queryParams: Record<string, string> = {
      businessId: getBusinessId(), // ✅ Add businessId
    };
    
    if (params?.status && params.status !== 'all') {
      queryParams.status = params.status;
    }
    
    const response = await apiClient.get<Campaign[]>('/campaigns', { params: queryParams });
    return response.data;
  },

  async getOne(id: string): Promise<Campaign> {
    const response = await apiClient.get<Campaign>(`/campaigns/${id}`, {
      params: { businessId: getBusinessId() } // ✅ Add businessId
    });
    return response.data;
  },

  async create(data: CreateCampaignDto): Promise<Campaign> {
    const payload = {
      ...data,
      businessId: getBusinessId(), // ✅ Add businessId to body
    };
    
    const response = await apiClient.post<Campaign>('/campaigns', payload);
    return response.data;
  },

  async getLogs(campaignId: string): Promise<CampaignLog[]> {
    const response = await apiClient.get<CampaignLog[]>(`/campaigns/${campaignId}/logs`, {
      params: { businessId: getBusinessId() } // ✅ Add businessId
    });
    return response.data;
  },

  async cancel(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/campaigns/${id}`, {
      params: { businessId: getBusinessId() } // ✅ Add businessId
    });
    return response.data;
  },

  async getStats(): Promise<CampaignStats> {
    const response = await apiClient.get<CampaignStats>('/campaigns/stats', {
      params: { businessId: getBusinessId() } // ✅ Add businessId
    });
    return response.data;
  },
};