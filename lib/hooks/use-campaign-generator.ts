import { useState } from "react";
import { campaignService } from "@/lib/services/campaign.service";
import type {
  GenerateCampaignRequest,
  CampaignResponse,
  CreateGeneratedCampaignDto,
} from "@/lib/types/campaign";

export function useCampaignGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignResponse | null>(null);

  /** Generates a campaign using AI */
  const generateCampaign = async (data: GenerateCampaignRequest) => {
    setLoading(true);
    setError(null);
    setCampaign(null);

    try {
      const response = await campaignService.generateCampaign(data);
      setCampaign(response.campaign);
      return response.campaign;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate campaign";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCampaign(null);
    setError(null);
  };

  /**
   * Creates a generated campaign in the backend
   * Automatically maps:
   * - First AI template as the message
   * - First schedule datetime as `scheduled_at` if scheduled
   * - Target segments from strategy
   */
  async function handleCreateGeneratedCampaign(
    businessId: string,
    generatedCampaign: CampaignResponse,
    campaignName: string
  ) {
    if (!generatedCampaign) throw new Error("Missing generated campaign data.");
    if (!campaignName || campaignName.trim() === "") throw new Error("Campaign name is required.");

    // Pick primary template
    const primaryTemplate = generatedCampaign.templates[0];
    const message = primaryTemplate?.message || "Default message";
    const template_type = primaryTemplate?.template_type || "generic";

    // Determine schedule
    const firstSchedule = generatedCampaign.schedule?.[0];
    const schedule_type = firstSchedule ? "scheduled" : "immediate";
    const scheduled_at = firstSchedule ? new Date(firstSchedule.send_datetime) : undefined;


    const dto: CreateGeneratedCampaignDto = {
      name: campaignName,
      message_content: message,
      template_type,
      schedule_type,
      scheduled_at,
      target_leads: (generatedCampaign.strategy?.target_segments || []).filter(
        (segment): segment is "hot" | "warm" | "cold" =>
          segment === "hot" || segment === "warm" || segment === "cold"
      ),
    };

    const created = await campaignService.createGenerated(businessId, dto);
    return created;
  }

  return {
    campaign,
    loading,
    error,
    generateCampaign,
    handleCreateGeneratedCampaign,
    reset,
  };
}
