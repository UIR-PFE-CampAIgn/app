import { useState, useEffect, useCallback } from 'react';
import { businessService } from '../services/business.service';
import type { Business } from '../types/business';
import { useUser } from '@/app/contexts/UserContext';

interface UseBusinessReturn {
  business: Business | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBusiness = (id: string): UseBusinessReturn => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useUser();
 
  const fetchBusiness = useCallback(async () => {
    if (!id || !userId) return;
    try {
      setLoading(true);
      const data = await businessService.getBusinessById(id,userId);
      setBusiness(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message :'Failed to fetch business';
      setError(errorMessage);
      console.error('Error fetching business:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  return {
    business,
    loading,
    error,
    refetch: fetchBusiness,
  };
};