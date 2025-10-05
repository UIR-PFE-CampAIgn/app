import { campaignsApi } from '@/lib/api/campaigns';
import { Campaign, CampaignLog, CreateCampaignDto, CampaignStats } from '@/lib/types/campaign';
import { createCampaignSchema, CreateCampaignInput } from '@/lib/validators/campaign.validator';
import { ZodError } from "zod";

class CampaignService {
  


  validateCampaign(data: CreateCampaignInput): { valid: boolean; errors: string[] } {
    try {
      createCampaignSchema.parse(data);
      return { valid: true, errors: [] };
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => e.message);
        return { valid: false, errors };
      }
      return { valid: false, errors: ['Validation failed'] };
    }
  }
  

  async getAll(filters?: { status?: string }): Promise<Campaign[]> {
    try {
      const campaigns = await campaignsApi.getAll(filters);
      
      
      return campaigns;
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      throw new Error('Unable to load campaigns. Please try again.');
    }
  }

  async create(data: CreateCampaignDto): Promise<Campaign> {
    // Validate before sending
    const validation = this.validateCampaign(data as CreateCampaignInput);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    try {
      const campaign = await campaignsApi.create(data);
      return campaign;
    } catch (error) {
      console.error('Failed to create campaign:', error);
      throw new Error('Unable to create campaign. Please try again.');
    }
  }

  async getLogs(campaignId: string): Promise<CampaignLog[]> {
    try {
      return await campaignsApi.getLogs(campaignId);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      throw new Error('Unable to load campaign logs. Please try again.');
    }
  }

  async cancel(campaignId: string): Promise<void> {
    try {
      await campaignsApi.cancel(campaignId);
    } catch (error) {
      console.error('Failed to cancel campaign:', error);
      throw new Error('Unable to cancel campaign. Please try again.');
    }
  }

  async getStats(): Promise<CampaignStats> {
    try {
      return await campaignsApi.getStats();
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return {
        total_campaigns: 0,
        active_campaigns: 0,
        total_sent: 0,
        success_rate: 0,
      };
    }
  }

  formatScheduleType(type: string): string {
    const labels = {
      immediate: 'Send Immediately',
      scheduled: 'Scheduled',
      recurring: 'Recurring',
    };
    return labels[type as keyof typeof labels] || type;
  }

  calculateProgress(campaign: Campaign): number {
    if (campaign.total_recipients === 0) return 0;
    return Math.round((campaign.sent_count / campaign.total_recipients) * 100);
  }

}

export const campaignService = new CampaignService();