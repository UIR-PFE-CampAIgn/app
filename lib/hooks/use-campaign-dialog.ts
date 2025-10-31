'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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
    target_leads: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedScores, setSelectedScores] = useState<string[]>([]);

  // 🔹 Handle `?create=true` query
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const createQuery = searchParams.get('create');

    if (createQuery === 'true') {
      setOpen(true);

      //  clean up URL after opening
      const newUrl = pathname; // removes ?create=true
      router.replace(newUrl);
    }
  }, [searchParams, router, pathname]);

  // ✅ Validation
  const validate = (): boolean => {
    try {
      campaignFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) newErrors[err.path.join('.')] = err.message;
        });
        setErrors(newErrors);
        return false;
      }
      console.error('Unexpected validation error:', error);
      return false;
    }
  };

  // ✅ Reset
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

  // ✅ Prepare DTO
  const prepareDto = (): CreateCampaignDto => {
    const dto: CreateCampaignDto = {
      template_id: formData.template_id,
      name: formData.name,
      schedule_type: formData.schedule_type,
      target_leads: formData.target_leads,
    };

    if (formData.schedule_type === 'scheduled') {
      if (formData.scheduled_date && formData.scheduled_time) {
        dto.scheduled_at = `${formData.scheduled_date}T${formData.scheduled_time}`;
      }
    }

    return dto;
  };

  // ✅ Score Toggles
  const toggleScore = (score: 'hot' | 'warm' | 'cold') => {
    setSelectedScores(prev => {
      const newSelected = prev.includes(score)
        ? prev.filter(s => s !== score)
        : [...prev, score];
      setFormData({ ...formData, target_leads: newSelected as ('hot' | 'warm' | 'cold')[] });
      return newSelected;
    });
  };

  const selectAllScores = (scores: ('hot' | 'warm' | 'cold')[]) => {
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
