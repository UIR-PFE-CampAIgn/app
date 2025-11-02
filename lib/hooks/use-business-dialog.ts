'use client';

import { useEffect, useState } from "react";
import type { Business } from "../types/business";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

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

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 🔹 Auto-open create dialog from ?create=true
  useEffect(() => {
    const createQuery = searchParams.get('create');

    if (createQuery === 'true') {
      openCreate();

      // ✅ Clean up the URL to prevent reopening on refresh
      const newUrl = pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router, pathname]);

  // 🔹 Dialog control handlers
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

    // Small delay to avoid UI flicker when closing animations
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
