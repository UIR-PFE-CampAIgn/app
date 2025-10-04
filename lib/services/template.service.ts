// lib/services/template.service.ts
import { templatesApi } from '@/lib/api/templates';
import { MessageTemplate, CreateTemplateDto, UpdateTemplateDto } from '@/lib/types/template';
import { 
  createTemplateSchema, 
  updateTemplateSchema, 
  templateQuerySchema 
} from '@/lib/validators/template.validator';

class TemplateService {

  extractVariables(content: string): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = content.matchAll(regex);
    return Array.from(new Set(Array.from(matches, m => m[1])));
  }

  async getAll(filters?: { category?: string; search?: string }): Promise<MessageTemplate[]> {
    // Validate filters with Zod
    const validatedFilters = templateQuerySchema.parse(filters || {});
    
    

    try {
      const templates = await templatesApi.getAll(validatedFilters);
      return templates;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      throw new Error('Unable to load templates. Please try again.');
    }
  }

  async create(data: CreateTemplateDto): Promise<MessageTemplate> {
    // Zod replaces validateTemplate method
    const validated = createTemplateSchema.parse(data);

    try {
      const template = await templatesApi.create(validated);
      return template;
    } catch (error) {
      console.error('Failed to create template:', error);
      throw new Error('Unable to create template. Please try again.');
    }
  }

  async update(id: string, data: UpdateTemplateDto): Promise<MessageTemplate> {
    // Validate with Zod
    const validated = updateTemplateSchema.parse(data);

    try {
      const template = await templatesApi.update(id, validated);
      return template;
    } catch (error) {
      console.error('Failed to update template:', error);
      throw new Error('Unable to update template. Please try again.');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await templatesApi.delete(id);
    } catch (error) {
      console.error('Failed to delete template:', error);
      throw new Error('Unable to delete template. Please try again.');
    }
  }

  async duplicate(id: string): Promise<MessageTemplate> {
    try {
      const template = await templatesApi.duplicate(id);
      return template;
    } catch (error) {
      console.error('Failed to duplicate template:', error);
      throw new Error('Unable to duplicate template. Please try again.');
    }
  }

  formatTemplate(template: MessageTemplate): MessageTemplate & { displayDate: string } {
    return {
      ...template,
      displayDate: template.last_used_at 
        ? new Date(template.last_used_at).toLocaleDateString()
        : 'Never used',
    };
  }

}

export const templateService = new TemplateService();