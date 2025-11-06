
export interface Product {
    id: string;
    business_id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    sku?: string;
    stock: number;
    category?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface CreateProductDto {
    business_id: string;
    name: string;
    price: number;
    currency?: string;
    description?: string;
    sku?: string;
    stock?: number;
    category?: string;
  }
  
  export interface UpdateProductDto {
    name?: string;
    price?: number;
    currency?: string;
    description?: string;
    sku?: string;
    stock?: number;
    category?: string;
    is_active?: boolean;
  }
  
  export interface ProductFilters {
    businessId: string;
    category?: string;
    search?: string;
  }