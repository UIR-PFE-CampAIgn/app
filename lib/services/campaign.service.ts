import { campaignsApi } from '@/lib/api/campaigns';
import { Campaign, CampaignLog, CreateCampaignDto, CampaignStats } from '@/lib/types/campaign';
import { createCampaignSchema, CreateCampaignInput } from '@/lib/validators/campaign.validator';
import { ZodError } from 'zod';

class CampaignService {
  validateCampaign(data: CreateCampaignInput) {
    try {
      createCampaignSchema.parse(data);
      return { valid: true, errors: [] };
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return { valid: false, errors: error.errors.map(e => e.message) };
      }
      return { valid: false, errors: ['Validation failed'] };
    }
  }

  async getAll(businessId: string, filters?: { status?: string }): Promise<Campaign[]> {
    return campaignsApi.getAll({ businessId, ...filters });
  }

  async create(businessId: string, data: CreateCampaignDto): Promise<Campaign> {
    const validation = this.validateCampaign(data as CreateCampaignInput);
    if (!validation.valid) throw new Error(validation.errors.join(', '));
    
    // ✅ Convert scheduled_at to UTC ISO string before sending to API
    const payload = {
      ...data,
      businessId,
      scheduled_at: data.scheduled_at 
        ? new Date(data.scheduled_at).toISOString() 
        : undefined,
    };

    return campaignsApi.create(payload);
  }

  async getLogs(businessId: string, campaignId: string): Promise<CampaignLog[]> {
    return campaignsApi.getLogs(campaignId, businessId);
  }

  async cancel(businessId: string, campaignId: string): Promise<void> {
    await campaignsApi.cancel(campaignId, businessId);
  }

  async getStats(businessId: string): Promise<CampaignStats> {
    return campaignsApi.getStats(businessId);
  }

  calculateProgress(campaign: Campaign): number {
    if (campaign.total_recipients === 0) return 0;
    return Math.round((campaign.sent_count / campaign.total_recipients) * 100);
  }

  formatScheduleType(type: string): string {
    const labels: Record<string, string> = {
      immediate: 'Send Immediately',
      scheduled: 'Scheduled',
      recurring: 'Recurring',
    };
    return labels[type] || type;
  }

  // ✅ Helper: Convert UTC timestamp to local time for display
  formatScheduledTime(utcDate: string | Date | undefined): string {
    if (!utcDate) return 'Not scheduled';
    
    const date = new Date(utcDate);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  // ✅ Helper: Get user's timezone offset (for debugging/display)
  getUserTimezoneOffset(): number {
    return -new Date().getTimezoneOffset() / 60; // Returns +1 for GMT+1
  }

  // ✅ Helper: Convert cron expression from local time to UTC
  convertCronToUTC(cronExpression: string): string {
    const parts = cronExpression.split(' ');
    
    if (parts.length < 5) {
      throw new Error('Invalid cron expression format');
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    
    // Parse hour
    let hourNum = parseInt(hour);
    if (isNaN(hourNum)) {
      // If hour is a wildcard or special syntax, return as-is
      return cronExpression;
    }
    
    // Get user's timezone offset
    const offsetHours = this.getUserTimezoneOffset();
    
    // Convert to UTC by subtracting the offset
    hourNum = (hourNum - offsetHours + 24) % 24;
    
    return `${minute} ${hourNum} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }

  // ✅ Helper: Format cron for display (convert UTC back to local)
  formatCronForDisplay(utcCronExpression: string): string {
    const parts = utcCronExpression.split(' ');
    
    if (parts.length < 5) return utcCronExpression;

    const [minute, hour] = parts;
    const hourNum = parseInt(hour);
    
    if (isNaN(hourNum)) return utcCronExpression;
    
    const offsetHours = this.getUserTimezoneOffset();
    const localHour = (hourNum + offsetHours) % 24;
    
    return `Every day at ${localHour.toString().padStart(2, '0')}:${minute}`;
  }
}

export const campaignService = new CampaignService();