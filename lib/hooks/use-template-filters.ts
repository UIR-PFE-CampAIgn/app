// lib/hooks/use-template-filters.ts
import { useState, useMemo } from "react";
import { MessageTemplate } from "@/lib/types/template";

export function useTemplateFilters(templates: MessageTemplate[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || template.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, categoryFilter]);

  return {
    searchTerm,
    categoryFilter,
    setSearchTerm,
    setCategoryFilter,
    filteredTemplates,
  };
}
