// lib/hooks/useProductDialog.ts

import { useState } from "react";
import { Product } from "@/lib/types/products";

export function useProductDialog() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openCreate = () => {
    setIsCreateOpen(true);
    setSelectedProduct(null);
  };

  const openEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const openDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const closeDialogs = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedProduct(null);
  };

  return {
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    selectedProduct,
    openCreate,
    openEdit,
    openDelete,
    closeDialogs,
  };
}