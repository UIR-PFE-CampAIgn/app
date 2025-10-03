import { templatesApi } from '@/lib/api/templates';
import { MessageTemplate, CreateTemplateDto, UpdateTemplateDto } from '@/lib/types/template';

// Business logic - validation, transformation, error handling
class TemplateService {
  private cache: Map<string, MessageTemplate[]> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  // Extract variables from content
  extractVariables(content: string): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = content.matchAll(regex);
    return Array.from(new Set(Array.from(matches, m => m[1])));
  }

  // Validate template before creating
  validateTemplate(data: CreateTemplateDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 3) {
      errors.push('Name must be at least 3 characters');
    }

    if (!data.content || data.content.trim().length < 10) {
      errors.push('Content must be at least 10 characters');
    }

    const variables = this.extractVariables(data.content);
    if (variables.length > 10) {
      errors.push('Too many variables (max 10)');
    }

    return { valid: errors.length === 0, errors };
  }

  // Get all with caching
  async getAll(filters?: { category?: string; search?: string }, forceRefresh = false): Promise<MessageTemplate[]> {
    const cacheKey = JSON.stringify(filters || {});
    
    if (!forceRefresh && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const templates = await templatesApi.getAll(filters);
      this.cache.set(cacheKey, templates);
      
      // Clear cache after timeout
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      
      return templates;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      throw new Error('Unable to load templates. Please try again.');
    }
  }

  async create(data: CreateTemplateDto): Promise<MessageTemplate> {
    const validation = this.validateTemplate(data);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    try {
      const template = await templatesApi.create(data);
      this.clearCache(); // Invalidate cache
      return template;
    } catch (error) {
      console.error('Failed to create template:', error);
      throw new Error('Unable to create template. Please try again.');
    }
  }

  async update(id: string, data: UpdateTemplateDto): Promise<MessageTemplate> {
    if (data.name && data.name.trim().length < 3) {
      throw new Error('Name must be at least 3 characters');
    }

    try {
      const template = await templatesApi.update(id, data);
      this.clearCache();
      return template;
    } catch (error) {
      console.error('Failed to update template:', error);
      throw new Error('Unable to update template. Please try again.');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await templatesApi.delete(id);
      this.clearCache();
    } catch (error) {
      console.error('Failed to delete template:', error);
      throw new Error('Unable to delete template. Please try again.');
    }
  }

  async duplicate(id: string): Promise<MessageTemplate> {
    try {
      const template = await templatesApi.duplicate(id);
      this.clearCache();
      return template;
    } catch (error) {
      console.error('Failed to duplicate template:', error);
      throw new Error('Unable to duplicate template. Please try again.');
    }
  }

  // Format template for display
  formatTemplate(template: MessageTemplate): MessageTemplate & { displayDate: string } {
    return {
      ...template,
      displayDate: template.last_used_at 
        ? new Date(template.last_used_at).toLocaleDateString()
        : 'Never used',
    };
  }

  private clearCache() {
    this.cache.clear();
  }
}

// Singleton instance
export const templateService = new TemplateService();