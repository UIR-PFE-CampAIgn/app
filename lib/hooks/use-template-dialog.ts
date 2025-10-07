import { useState } from "react";
import { MessageTemplate } from "@/lib/types/template";

export function useTemplateDialog() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

  const openCreate = () => {
    setIsCreateOpen(true);
    setSelectedTemplate(null);
  };

  const openEdit = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setIsEditOpen(true);
  };

  const openDelete = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setIsDeleteOpen(true);
  };

  const closeDialogs = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedTemplate(null);
  };

  return {
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    selectedTemplate,
    openCreate,
    openEdit,
    openDelete,
    closeDialogs,
  };
}