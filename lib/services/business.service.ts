// lib/services/business.service.ts
import { businessApi } from '../api/business';
import type { CreateBusinessDto, UpdateBusinessDto } from '../dto/business.dto';
import type { Business } from '../types/business';

export class BusinessService {
  async getAllBusinesses(userId: string): Promise<Business[]> {
    try {
      return await businessApi.getAll(userId);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  }

  async getBusinessById(id: string,userId:string): Promise<Business> {
    try {
      return await businessApi.getById(id,userId);
    } catch (error) {
      console.error(`Error fetching business ${id}:`, error);
      throw error;
    }
  }

  async createBusiness(data: CreateBusinessDto, userId: string): Promise<Business> {
    if (!userId) throw new Error('User not authenticated');
  
    try {
      return await businessApi.create(data, userId); // pass userId to api
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  }
  
  

  async updateBusiness(
    businessId: string,
    data: UpdateBusinessDto,
    userId: string
  ): Promise<Business> {
    if (!userId) throw new Error('User not authenticated');
  
    return await businessApi.update(businessId, data, userId);
  }
  

  
  async deleteBusiness(id: string, userId: string): Promise<void> {
    try {
      await businessApi.delete(id, userId);
    } catch (error) {
      console.error(`Error deleting business ${id}:`, error);
      throw error;
    }
  }
  
  

 
}

// Export singleton instance
export const businessService = new BusinessService();