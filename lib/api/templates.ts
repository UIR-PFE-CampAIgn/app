import { MessageTemplate, CreateTemplateDto, UpdateTemplateDto } from '@/lib/types/template';

const API_URL = process.env.NEXT_PUBLIC_API_URL ;

// Pure API calls - no business logic
export const templatesApi = {
  async getAll(params?: { category?: string; search?: string }): Promise<MessageTemplate[]> {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') {
      searchParams.append('category', params.category);
    }
    if (params?.search) {
      searchParams.append('search', params.search);
    }
    
    const url = `/message-templates${searchParams.toString() ? `?${searchParams}` : ''}`;
    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`, // Helper function
      },
    });

    if (!response.ok) throw new Error('Failed to fetch templates');
    return response.json();
  },

  async create(data: CreateTemplateDto): Promise<MessageTemplate> {
    const response = await fetch(`${API_URL}/message-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create template');
    return response.json();
  },

  async update(id: string, data: UpdateTemplateDto): Promise<MessageTemplate> {
    const response = await fetch(`${API_URL}/message-templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update template');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/message-templates/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) throw new Error('Failed to delete template');
  },

  async duplicate(id: string): Promise<MessageTemplate> {
    const response = await fetch(`${API_URL}/message-templates/${id}/duplicate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) throw new Error('Failed to duplicate template');
    return response.json();
  },
};

// Helper function
function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}