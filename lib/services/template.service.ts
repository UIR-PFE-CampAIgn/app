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
    // ✅ Use safeParse to avoid throwing
    const validation = templateQuerySchema.safeParse(filters || {});

    if (!validation.success) {
      console.error('Invalid filters:', validation.error.flatten());
      throw new Error('Invalid filter parameters.');
    }
    try {
      const templates = await templatesApi.getAll(validation.data);
      return templates;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      throw new Error('Unable to load templates. Please try again.');
    }
  }

  async create(data: CreateTemplateDto): Promise<MessageTemplate> {
    // ✅ Use safeParse instead of parse
    const validation = createTemplateSchema.safeParse(data);

    if (!validation.success) {
      console.error('Invalid template data:', validation.error.flatten());
      throw new Error('Invalid template data.');
    }

    try {
      const template = await templatesApi.create(validation.data);
      return template;
    } catch (error) {
      console.error('Failed to create template:', error);
      throw new Error('Unable to create template. Please try again.');
    }
  }

  async update(id: string, data: UpdateTemplateDto): Promise<MessageTemplate> {
    // ✅ Use safeParse here too
    const validation = updateTemplateSchema.safeParse(data);

    if (!validation.success) {
      console.error('Invalid update data:', validation.error.flatten());
      throw new Error('Invalid update data.');
    }

    try {
      const template = await templatesApi.update(id, validation.data);
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
