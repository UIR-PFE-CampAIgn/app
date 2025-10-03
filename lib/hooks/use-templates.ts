'use client';

import { useState, useCallback } from 'react';
import { templateService } from '@/lib/services/template.service';
import { MessageTemplate, CreateTemplateDto, UpdateTemplateDto } from '@/lib/types/template';

export function useTemplates() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async (filters?: { category?: string; search?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await templateService.getAll(filters);
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (data: CreateTemplateDto) => {
    try {
      const newTemplate = await templateService.create(data);
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateTemplate = useCallback(async (id: string, data: UpdateTemplateDto) => {
    try {
      const updated = await templateService.update(id, data);
      setTemplates(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      await templateService.delete(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      throw err;
    }
  }, []);

  const duplicateTemplate = useCallback(async (id: string) => {
    try {
      const duplicated = await templateService.duplicate(id);
      setTemplates(prev => [duplicated, ...prev]);
      return duplicated;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
  };
}