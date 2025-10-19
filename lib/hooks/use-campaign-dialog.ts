'use client';

import { useState } from 'react';
import { CreateCampaignDto } from '@/lib/types/campaign';
import { campaignFormSchema, CampaignFormInput } from '@/lib/validators/campaign.validator';
import { ZodError } from "zod";

export function useCampaignDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CampaignFormInput>({
    name: '',
    template_id: '',
    schedule_type: 'immediate',
    scheduled_date: '',
    scheduled_time: '',
    target_leads: [], // will store score values only
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedScores, setSelectedScores] = useState<string[]>([]);


const validate = (): boolean => {
  try {
    campaignFormSchema.parse(formData);
    setErrors({});
    return true;
  } catch (error) {
    if (error instanceof ZodError) {
      const newErrors: Record<string, string> = {};

      error.errors.forEach((err) => {
        if (err.path) {
          newErrors[err.path.join(".")] = err.message;
        }
      });

      setErrors(newErrors);
      return false;
    }

    // In case it's an unexpected error type
    console.error("Unexpected validation error:", error);
    return false;
  }
};


  const reset = () => {
    setFormData({
      name: '',
      template_id: '',
      schedule_type: 'immediate',
      scheduled_date: '',
      scheduled_time: '',
      target_leads: [],
    });
    setSelectedScores([]);
    setErrors({});
  };

  const prepareDto = (): CreateCampaignDto => {
    const dto: CreateCampaignDto = {
      name: formData.name,
      template_id: formData.template_id,
      schedule_type: formData.schedule_type,
      target_leads: formData.target_leads, // score values only
    };

    if (formData.schedule_type === 'scheduled' && formData.scheduled_date && formData.scheduled_time) {
      dto.scheduled_at = `${formData.scheduled_date}T${formData.scheduled_time}:00Z`;
    }

    return dto;
  };

  // ✅ toggle by score
  const toggleScore = (score: string) => {
    setSelectedScores(prev => {
      const newSelected = prev.includes(score)
        ? prev.filter(s => s !== score)
        : [...prev, score];

      setFormData({ ...formData, target_leads: newSelected });
      return newSelected;
    });
  };

  const selectAllScores = (scores: string[]) => {
    setSelectedScores(scores);
    setFormData({ ...formData, target_leads: scores });
  };

  const clearScores = () => {
    setSelectedScores([]);
    setFormData({ ...formData, target_leads: [] });
  };

  return {
    open,
    setOpen,
    formData,
    setFormData,
    errors,
    validate,
    reset,
    prepareDto,
    selectedScores,
    toggleScore,
    selectAllScores,
    clearScores,
  };
}
