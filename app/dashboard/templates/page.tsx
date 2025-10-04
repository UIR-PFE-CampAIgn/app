"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  MessageSquare,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useTemplates } from "@/lib/hooks/use-templates";
import { useTemplateFilters } from "@/lib/hooks/use-template-filters";
import { useTemplateDialog } from "@/lib/hooks/use-template-dialog";
import { templateService } from "@/lib/services/template.service";
import { MessageTemplate } from "@/lib/types/template";
import { ALLOWED_VARIABLE_KEYS, ALLOWED_VARIABLES } from "@/lib/constants/template-variables";

// Zod schema for form validation
const templateFormSchema = z.object({
  name: z.string().min(1, "Template name is required").max(100, "Name too long"),
  content: z.string().min(1, "Content is required").max(5000, "Content too long"),
  category: z.enum(["onboarding", "transactional", "follow-up", "promotional", "general"]),
  language: z.string().min(2, "Language is required"),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

export default function MessageTemplatesPage() {
  const { toast } = useToast();
  const {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
  } = useTemplates();

  // Custom hooks for state management
  const {
    searchTerm,
    categoryFilter,
    setSearchTerm,
    setCategoryFilter,
    filteredTemplates,
  } = useTemplateFilters(templates);

  const {
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    selectedTemplate,
    openCreate,
    openEdit,
    openDelete,
    closeDialogs,
  } = useTemplateDialog();

  // React Hook Form
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      content: "",
      category: "general",
      language: "EN",
    },
  });

  // Load templates on mount
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const extractVariables = (content: string): string[] => {
    return templateService.extractVariables(content);
  };

  const handleCreate = async (values: TemplateFormValues) => {
    try {
      await createTemplate(values);
      closeDialogs();
      form.reset();
      toast({
        title: "Success",
        description: "Template created successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to create template',
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (values: TemplateFormValues) => {
    if (!selectedTemplate) return;
    try {
      await updateTemplate(selectedTemplate.id, values);
      closeDialogs();
      form.reset();
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update template',
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;
    try {
      await deleteTemplate(selectedTemplate.id);
      closeDialogs();
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to delete template',
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (templateId: string) => {
    try {
      await duplicateTemplate(templateId);
      toast({
        title: "Success",
        description: "Template duplicated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to duplicate template',
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    // Validate searchTerm is not empty or whitespace only
    const trimmedSearch = searchTerm.trim();
    
    fetchTemplates({
      search: trimmedSearch || undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
    });
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    const trimmedSearch = searchTerm.trim();
    fetchTemplates({
      search: trimmedSearch || undefined,
      category: category !== 'all' ? category : undefined,
    });
  };

  const onOpenEditDialog = (template: MessageTemplate) => {
    openEdit(template);
    form.reset({
      name: template.name,
      content: template.content,
      category: template.category,
      language: template.language,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      onboarding: "bg-blue-100 text-blue-700 border-blue-200",
      transactional: "bg-green-100 text-green-700 border-green-200",
      "follow-up": "bg-purple-100 text-purple-700 border-purple-200",
      promotional: "bg-orange-100 text-orange-700 border-orange-200",
      general: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return colors[category] || colors.general;
  };

  // Watch content field for variable preview
  const contentValue = form.watch("content");

  // Loading state
  if (loading && templates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Message Templates
              </h1>
              <p className="text-slate-600 mt-1">
                Create and manage reusable message templates for your campaigns
              </p>
            </div>
            <Button
              onClick={openCreate}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-white border-slate-200"
              />
            </div>
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="transactional">Transactional</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="promotional">Promotional</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="outline">
              Search
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <Button 
              onClick={() => fetchTemplates()} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.language}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 line-clamp-3 mb-4 min-h-[60px]">
                  {template.content}
                </p>

                {/* Variables */}
                {template.variables.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs font-medium text-slate-700">Variables:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable: string) => (
                        <Badge key={variable} variant="secondary" className="text-xs font-mono">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pt-3 border-t">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Used {template.usage_count} times
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {template.last_used_at ? new Date(template.last_used_at).toLocaleDateString() : 'Never'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenEditDialog(template)}
                    className="flex-1"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(template.id)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDelete(template)}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && !loading && (
          <Card className="border-dashed border-2 bg-white">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No templates found
              </h3>
              <p className="text-slate-500 text-center max-w-sm mb-6">
                {searchTerm || categoryFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first message template to get started"}
              </p>
              {!searchTerm && categoryFilter === "all" && (
                <Button onClick={openCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateOpen || isEditOpen} onOpenChange={closeDialogs}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditOpen ? "Edit" : "Create"} Message Template</DialogTitle>
              <DialogDescription>
                {isEditOpen ? "Update your template content and settings" : "Create a reusable template with personalized variables"}
              </DialogDescription>
            </DialogHeader>
            {/* Available Variables Section */}
  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
    <div className="flex items-center gap-2 mb-3">
      <Sparkles className="h-4 w-4 text-blue-600" />
      <span className="text-sm font-semibold text-blue-900">
        Available Variables
      </span>
    </div>
    <div className="flex flex-wrap gap-2">
      {ALLOWED_VARIABLES.map((variable) => (
        <Badge
          key={variable.key}
          variant="secondary"
          className="cursor-pointer hover:bg-blue-100"
          onClick={() => {
            const current = form.getValues("content");
            form.setValue("content", current + `{{${variable.key}}}`);
          }}
          title={variable.description}
        >
          {`{{${variable.key}}}`}
        </Badge>
      ))}
    </div>
    <p className="text-xs text-blue-700 mt-2">
      Click a variable to insert it into your template
    </p>
  </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(isEditOpen ? handleEdit : handleCreate)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Welcome Message" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="onboarding">Onboarding</SelectItem>
                            <SelectItem value="transactional">Transactional</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                            <SelectItem value="promotional">Promotional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EN">English</SelectItem>
                            <SelectItem value="ES">Spanish</SelectItem>
                            <SelectItem value="FR">French</SelectItem>
                            <SelectItem value="AR">Arabic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here... Use {{variableName}} for personalization"
                          rows={6}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use double curly braces for variables. Only predefined variables are allowed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preview Variables */}
                {(() => {
  const detectedVars = extractVariables(contentValue || "");
  const validVars = detectedVars.filter(
    v => ALLOWED_VARIABLE_KEYS.includes(v as (typeof ALLOWED_VARIABLE_KEYS)[number])
  );
  
  const invalidVars = detectedVars.filter(
    v => !ALLOWED_VARIABLE_KEYS.includes(v as (typeof ALLOWED_VARIABLE_KEYS)[number])
  );
  

  return (
    <>
      {validVars.length > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              Valid Variables:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {validVars.map((variable) => (
              <Badge key={variable} className="bg-green-100 text-green-800 border-green-300">
                {`{{${variable}}}`}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {invalidVars.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-red-900">
              Invalid Variables (not allowed):
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {invalidVars.map((variable) => (
              <Badge key={variable} variant="destructive">
                {`{{${variable}}}`}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-red-700 mt-2">
            Remove these or choose from available variables above
          </p>
        </div>
      )}
    </>
  );
})()}

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeDialogs}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isEditOpen ? "Save Changes" : "Create Template"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={closeDialogs}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Template</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{selectedTemplate?.name}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialogs}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}