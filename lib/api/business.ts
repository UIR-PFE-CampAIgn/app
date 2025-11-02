// lib/api/business.ts
import { apiClient } from './axios-instance';
import type { Business } from '../types/business';
import type { CreateBusinessDto, UpdateBusinessDto } from '../dto/business.dto';

export const businessApi = {
  // Get all businesses
  getAll: async (userId: string) => {
    const response = await apiClient.get<Business[]>('/businesses', {
      params: { userId }
    });
    return response.data;
  },

  // Get single business by ID
  getById: async (id: string ,userId:string) => {
    const response = await apiClient.get<Business>(`/businesses/${id}`,{
      params:{userId}
    });
    return response.data;
  },

  // Create new business
  create: async (data: CreateBusinessDto, userId: string) => {
    const response = await apiClient.post<Business>(
      `/businesses?userId=${userId}`, // send userId as query param
      data
    );
    return response.data;
  },
  
  

  // Update business
  update: async (
    businessId: string,
    data: UpdateBusinessDto,
    userId: string
  ) => {
    const response = await apiClient.put<Business>(
      `/businesses/${businessId}?userId=${userId}`, // query param for backend
      data
    );
    return response.data;
  },
  

  // Delete business
  delete: async (businessId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/businesses/${businessId}?userId=${userId}`);
  },  

  
};