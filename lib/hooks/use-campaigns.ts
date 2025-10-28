import { useState, useCallback } from 'react';
import { campaignService } from '@/lib/services/campaign.service';
import { Campaign, CampaignLog, CreateCampaignDto } from '@/lib/types/campaign';
import { campaignsListSchema } from '../validators/campaign.validator';

export function useCampaigns(businessId: string | null) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async (filters?: { status?: string }) => {
    if (!businessId) return; // ✅ Guard if no businessId
    setLoading(true);
    setError(null);

    try {
      const data = await campaignService.getAll(businessId, filters);
      const result = campaignsListSchema.safeParse(data);

      if (result.success) {
        setCampaigns(result.data);
      } else {
        console.error("❌ Invalid campaign data:", result.error);
        setError("Invalid campaign data received from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const createCampaign = useCallback(async (data: CreateCampaignDto) => {
    if (!businessId) throw new Error("No businessId found");
    const newCampaign = await campaignService.create(businessId, data);
    setCampaigns(prev => [newCampaign, ...prev]);
    return newCampaign;
  }, [businessId]);

  const cancelCampaign = useCallback(async (id: string) => {
    if (!businessId) throw new Error("No businessId found");
    await campaignService.cancel(businessId, id);
    setCampaigns(prev =>
      prev.map(c => (c._id === id ? { ...c, status: 'failed' as const } : c))
    );
  }, [businessId]);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    cancelCampaign,
  };
}

export function useCampaignLogs(businessId: string | null, campaignId: string | null) {
  const [logs, setLogs] = useState<CampaignLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!businessId || !campaignId) return;
    setLoading(true);
    setError(null);

    try {
      const data = await campaignService.getLogs(businessId, campaignId);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [businessId, campaignId]);

  return { logs, loading, error, fetchLogs };
}
