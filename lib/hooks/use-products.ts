// lib/hooks/useProducts.ts

import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { productService } from '@/lib/services/products.service';
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from '@/lib/types/products';

/**
 * Centralized, type-safe error handler
 * Returns `never` so TS knows this function never returns normally.
 */
function handleError(
  err: unknown,
  setError: (msg: string) => void,
  fallbackMessage: string
): never {
  let message = fallbackMessage;

  if (err instanceof AxiosError) {
    message = err.response?.data?.message || err.message || fallbackMessage;
  } else if (err instanceof Error) {
    message = err.message || fallbackMessage;
  }

  setError(message);
  console.error(message, err);
  throw err; // ensures Promise rejects
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (filters: ProductFilters) => Promise<void>;
  createProduct: (data: CreateProductDto) => Promise<Product>;
  updateProduct: (id: string, data: UpdateProductDto) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string, businessId?: string) => Promise<Product>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all products
   */
  const fetchProducts = useCallback(async (filters: ProductFilters): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(filters);
      setProducts(data);
    } catch (err: unknown) {
      handleError(err, setError, 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a single product by ID
   */
  const getProductById = useCallback(
    async (id: string, businessId?: string): Promise<Product> => {
      try {
        setError(null);
        const product = await productService.getProductById(id, businessId);
        return product;
      } catch (err: unknown) {
        handleError(err, setError, 'Failed to fetch product');
      }
    },
    []
  );

  /**
   * Create a new product
   */
  const createProduct = useCallback(
    async (data: CreateProductDto): Promise<Product> => {
      try {
        setError(null);

        const newProduct = await productService.createProduct(data);

        // Add to local state
        setProducts((prev) => [newProduct, ...prev]);

        return newProduct;
      } catch (err: unknown) {
        handleError(err, setError, 'Failed to create product');
      }
    },
    []
  );

  /**
   * Update an existing product
   */
  const updateProduct = useCallback(
    async (id: string, data: UpdateProductDto): Promise<Product> => {
      try {
        setError(null);

        const updatedProduct = await productService.updateProduct(id, data);

        // Update in local state
        setProducts((prev) =>
          prev.map((product) => (product.id === id ? updatedProduct : product))
        );

        return updatedProduct;
      } catch (err: unknown) {
        handleError(err, setError, 'Failed to update product');
      }
    },
    []
  );

  /**
   * Delete a product
   */
  const deleteProduct = useCallback(
    async (id: string): Promise<void> => {
      try {
        setError(null);
        await productService.deleteProduct(id);

        // Remove from local state
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } catch (err: unknown) {
        handleError(err, setError, 'Failed to delete product');
      }
    },
    []
  );

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  };
}
