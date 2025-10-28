import { leadsApi } from '@/lib/api/leads';
import { Lead, GetLeadsParams } from '@/lib/types/lead';
import { leadsArraySchema, leadQuerySchema } from '@/lib/validators/lead.validator';

class LeadService {
  
  async getAll(params: GetLeadsParams): Promise<Lead[]> {
    // Validate businessId is present
    if (!params.businessId) {
      throw new Error('Business ID is required.');
    }

    // Validate query params
    const validation = leadQuerySchema.safeParse(params);
    if (!validation.success) {
      console.error('Invalid query params:', validation.error.flatten());
      throw new Error('Invalid search parameters.');
    }    
    
    try {
      // Pass businessId along with validated data
      const rawLeads = await leadsApi.getAll({
        ...validation.data,
        businessId: params.businessId
      });
      
      // Validate response data
      const leadsValidation = leadsArraySchema.safeParse(rawLeads);
      if (!leadsValidation.success) {
        console.error('Invalid leads data from API:', leadsValidation.error.flatten());
        throw new Error('Received invalid data from server.');
      }
      
      const leads = leadsValidation.data;
      
      return leads;
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      throw new Error('Unable to load leads. Please try again.');
    }
  }

  async getOne(id: string): Promise<Lead> {
    try {
      const lead = await leadsApi.getOne(id);
      return lead;
    } catch (error) {
      console.error('Failed to fetch lead:', error);
      throw new Error('Unable to load lead. Please try again.');
    }
  }

  async search(params: { searchTerm: string; businessId: string }): Promise<Lead[]> {
    if (!params.searchTerm.trim()) {
      return this.getAll({ businessId: params.businessId });
    }

    try {
      const leads = await this.getAll({ 
        search: params.searchTerm,
        businessId: params.businessId
      });
      return leads;
    } catch (error) {
      console.error('Failed to search leads:', error);
      throw new Error('Unable to search leads. Please try again.');
    }
  }

  formatLeadDisplay(lead: Lead): string {
    return lead.display_name || lead.provider_user_id || 'Unknown';
  }

  formatLeadInitials(lead: Lead): string {
    if (lead.display_name) {
      return lead.display_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return (lead.provider_user_id || 'UK').substring(0, 2).toUpperCase();
  }
}

export const leadService = new LeadService();
