'use client';

import { useState, useCallback } from 'react';
import { leadService } from '@/lib/services/lead.service';
import { Lead } from '@/lib/types/lead';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await leadService.getAll({ search, limit: 100 });
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchLeads = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await leadService.search(searchTerm);
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search leads');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    leads,
    loading,
    error,
    fetchLeads,
    searchLeads,
  };
}