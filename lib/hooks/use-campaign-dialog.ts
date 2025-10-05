'use client';
import { ZodError } from "zod";
import { useState } from 'react';
import { CreateCampaignDto } from '@/lib/types/campaign';
import { campaignFormSchema, CampaignFormInput } from '@/lib/validators/campaign.validator';

export function useCampaignDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CampaignFormInput>({
    name: '',
    template_id: '',
    schedule_type: 'immediate',
    scheduled_date: '',
    scheduled_time: '',
    target_leads: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});


const validate = (): boolean => {
  try {
    campaignFormSchema.parse(formData);
    setErrors({});
    return true;
  } catch (error: unknown) {
    const newErrors: Record<string, string> = {};

    if (error instanceof ZodError) {
      error.errors.forEach((err) => {
        if (err.path) {
          newErrors[err.path.join(".")] = err.message;
        }
      });
    }

    setErrors(newErrors);
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
    setErrors({});
  };

  const prepareDto = (): CreateCampaignDto => {
    const dto: CreateCampaignDto = {
      name: formData.name,
      template_id: formData.template_id,
      schedule_type: formData.schedule_type,
      target_leads: formData.target_leads,
    };

    if (formData.schedule_type === 'scheduled' && formData.scheduled_date && formData.scheduled_time) {
      dto.scheduled_at = `${formData.scheduled_date}T${formData.scheduled_time}:00Z`;
    }

    return dto;
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
  };
}