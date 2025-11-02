// lib/hooks/useBusinesses.ts
import { useState, useEffect, useCallback } from 'react';
import { businessService } from '../services/business.service';
import type { Business } from '../types/business';
import type { CreateBusinessDto, UpdateBusinessDto } from '../dto/business.dto';
import { useUser } from '@/app/contexts/UserContext';

interface UseBusinessesReturn {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createBusiness: (data: CreateBusinessDto) => Promise<Business | null>;
  updateBusiness: (id: string, data: UpdateBusinessDto) => Promise<Business | null>;
  deleteBusiness: (id: string) => Promise<boolean>;
}

export const useBusinesses = (): UseBusinessesReturn => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const userId = user?.appUserData?.user_id; // from your backend DB
  



  const fetchBusinesses = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await businessService.getAllBusinesses(userId);
      setBusinesses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message :  'Failed to fetch businesses';
      setError(errorMessage);
      console.error('Error fetching businesses:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchBusinesses();
    }
  }, [userId, fetchBusinesses]);


const createBusiness = async (data: CreateBusinessDto): Promise<Business | null> => {
    if (!userId) {
      setError('User not authenticated');
      return null;
    }
  
    try {
      setError(null);
  
      const newBusiness = await businessService.createBusiness(data, userId);
  
      setBusinesses(prev => [...prev, newBusiness]);
      return newBusiness;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message :  'Failed to create business';
      setError(errorMessage);
      console.error('Error creating business:', err);
      return null;
    }
  };


  const updateBusiness = async (
    businessId: string,
    data: UpdateBusinessDto
  ): Promise<Business | null> => {
    if (!userId) {
      setError('User not authenticated');
      return null;
    }
  
    try {
      setError(null);
  
      // Pass userId separately
      const updatedBusiness = await businessService.updateBusiness(
        businessId,
        data,
        userId // query param
      );
  
      // Update local state
      setBusinesses(prev =>
        prev.map(b => (b._id === businessId ? updatedBusiness : b))
      );
  
      return updatedBusiness;
    } catch (err) {
      const errorMessage =err instanceof Error ? err.message :  'Failed to update business';
      setError(errorMessage);
      console.error('Error updating business:', err);
      return null;
    }
  };
  

  const deleteBusiness = async (businessId: string): Promise<boolean> => {
    if (!userId) {
      setError('User not authenticated');
      return false;
    }
  
    try {
      await businessService.deleteBusiness(businessId, userId);
      setBusinesses(prev => prev.filter(b => b._id !== businessId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete business');
      return false;
    }
  };
  
  
  return {
    businesses,
    loading,
    error,
    refetch: fetchBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
  };
};