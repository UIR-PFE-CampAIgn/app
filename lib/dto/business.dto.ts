// lib/dto/business.dto.ts

export interface CreateBusinessDto {
    name: string;
    industry: string;
    description: string;
    status?: 'active' | 'inactive' | 'pending';
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    logo?: string;
  }
  
  export interface UpdateBusinessDto {
    name?: string;
    industry?: string;
    description?: string;
    status?: 'active' | 'inactive' | 'pending';
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    logo?: string;
  }
  
  export interface BusinessStatsDto {
    totalCampaigns: number;
    totalLeads: number;
    activeLeads: number;
    convertedLeads: number;
    conversionRate: number;
    revenue?: number;
  }