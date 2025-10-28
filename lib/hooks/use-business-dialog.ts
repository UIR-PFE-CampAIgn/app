// lib/hooks/use-business-dialog.ts
import { useState } from "react";
import type { Business } from "../types/business";

interface UseBusinessDialogReturn {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  selectedBusiness: Business | null;
  openCreate: () => void;
  openEdit: (business: Business) => void;
  openDelete: (business: Business) => void;
  closeDialogs: () => void;
}

export function useBusinessDialog(): UseBusinessDialogReturn {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const openCreate = () => {
    setSelectedBusiness(null);
    setIsCreateOpen(true);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
  };

  const openEdit = (business: Business) => {
    setSelectedBusiness(business);
    setIsEditOpen(true);
    setIsCreateOpen(false);
    setIsDeleteOpen(false);
  };

  const openDelete = (business: Business) => {
    setSelectedBusiness(business);
    setIsDeleteOpen(true);
    setIsCreateOpen(false);
    setIsEditOpen(false);
  };

  const closeDialogs = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    // Small delay before clearing selected business to avoid UI flash
    setTimeout(() => setSelectedBusiness(null), 150);
  };

  return {
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    selectedBusiness,
    openCreate,
    openEdit,
    openDelete,
    closeDialogs,
  };
}