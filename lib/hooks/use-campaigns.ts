'use client';

import { useState, useCallback } from 'react';
import { campaignService } from '@/lib/services/campaign.service';
import { Campaign, CampaignLog, CreateCampaignDto } from '@/lib/types/campaign';
import { campaignsListSchema } from '../validators/campaign.validator';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async (filters?: { status?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await campaignService.getAll(filters);

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
  }, []);

  const createCampaign = useCallback(async (data: CreateCampaignDto) => {
    try {
      const newCampaign = await campaignService.create(data);
      setCampaigns(prev => [newCampaign, ...prev]);
      return newCampaign;
    } catch (err) {
      throw err;
    }
  }, []);

  const cancelCampaign = useCallback(async (id: string) => {
    try {
      await campaignService.cancel(id);
      setCampaigns(prev => prev.map(c => 
        c._id === id ? { ...c, status: 'failed' as const } : c
      ));
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    cancelCampaign,
  };
}

export function useCampaignLogs(campaignId: string | null) {
  const [logs, setLogs] = useState<CampaignLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!campaignId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await campaignService.getLogs(campaignId);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  return {
    logs,
    loading,
    error,
    fetchLogs,
  };
}