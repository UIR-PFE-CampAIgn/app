// hooks/useTemplates.ts
import { useState, useCallback } from 'react';
import { templateService } from '@/lib/services/template.service';
import { MessageTemplate, CreateTemplateDto, UpdateTemplateDto } from '@/lib/types/template';

interface FetchTemplatesFilters {
  businessId: string;
  category?: string;
  search?: string;
}

export function useTemplates() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async (filters: FetchTemplatesFilters) => {
    if (!filters.businessId) {
      setError('Business ID is required');
      return;
    }

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

  const createTemplate = useCallback(async (template: CreateTemplateDto) => {
    setLoading(true);
    setError(null);

    try {
      const newTemplate = await templateService.create(template);
      console.log(newTemplate,"tempalte")
      setTemplates((prev) => [newTemplate, ...prev]);
      return newTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTemplate = useCallback(async (
    id: string, 
    updates: UpdateTemplateDto
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await templateService.update(id, updates);
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await templateService.delete(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicateTemplate = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const duplicated = await templateService.duplicate(id);
      setTemplates((prev) => [duplicated, ...prev]);
      return duplicated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate template');
      throw err;
    } finally {
      setLoading(false);
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