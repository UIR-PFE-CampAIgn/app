// lib/services/product.service.ts
import { productApi } from '../api/products';
import type { Product, CreateProductDto, UpdateProductDto, ProductFilters } from '../types/products';

class ProductService {
  /**
   * Fetch all products for a business
   */
  async getProducts(filters: ProductFilters): Promise<Product[]> {
    try {
      const products = await productApi.getAll(filters);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: string, businessId?: string): Promise<Product> {
    try {
      const product = await productApi.getById(id, businessId);
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      // Validate required fields
      if (!data.name || !data.price || !data.business_id) {
        throw new Error('Name, price, and business_id are required');
      }

      // Validate price is positive
      if (data.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const product = await productApi.create(data);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    try {
      // Validate price if provided
      if (data.price !== undefined && data.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const product = await productApi.update(id, data);
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<{ message: string }> {
    try {
      await productApi.delete(id);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Format price for display
   */
  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  }

}

export const productService = new ProductService();