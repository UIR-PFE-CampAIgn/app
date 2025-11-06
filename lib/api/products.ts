// lib/api/products.ts
import { apiClient } from './axios-instance';
import type { Product, CreateProductDto, UpdateProductDto, ProductFilters } from '../types/products';

export const productApi = {
  /**
   * Get all products for a business
   */
  async getAll(filters: ProductFilters): Promise<Product[]> {
    const params: Record<string, string> = {
      businessId: filters.businessId,
    };

    if (filters.category && filters.category !== 'all') {
      params.category = filters.category;
    }

    if (filters.search) {
      params.search = filters.search;
    }

    const response = await apiClient.get<Product[]>('/products', { params });
    return response.data;
  },

  /**
   * Get a single product by ID
   */
  async getById(id: string, businessId?: string): Promise<Product> {
    const params = businessId ? { businessId } : {};
    const response = await apiClient.get<Product>(`/products/${id}`, { params });
    return response.data;
  },

  /**
   * Create a new product
   */
  async create(data: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  /**
   * Update an existing product
   */
  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete a product
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
