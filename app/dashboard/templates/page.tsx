"use client";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type Template = {
  id: string;
  name: string;
  content: string;
  category: string;
  language: string;
  variables: string[];
  createdAt: string;
  lastUsed: string | null;
  usageCount: number;
};

const initialTemplates: Template[] = [
  {
    id: "1",
    name: "Welcome Message",
    content: "Hi {{name}}, welcome to our service! We're excited to have you on board. Reply with any questions.",
    category: "onboarding",
    language: "EN",
    variables: ["name"],
    createdAt: "2025-10-01",
    lastUsed: "2025-10-03",
    usageCount: 45,
  },
  {
    id: "2",
    name: "Order Confirmation",
    content: "Hello {{name}}, your order #{{orderNumber}} has been confirmed! Expected delivery: {{deliveryDate}}.",
    category: "transactional",
    language: "EN",
    variables: ["name", "orderNumber", "deliveryDate"],
    createdAt: "2025-09-28",
    lastUsed: "2025-10-02",
    usageCount: 128,
  },
  {
    id: "3",
    name: "Follow-up Reminder",
    content: "Hey {{name}}, just checking in! Have you had a chance to review our proposal? Let me know if you need anything.",
    category: "follow-up",
    language: "EN",
    variables: ["name"],
    createdAt: "2025-09-25",
    lastUsed: null,
    usageCount: 0,
  },
];

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    category: "general",
    language: "EN",
  });

  const extractVariables = (content: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = content.matchAll(regex);
    return Array.from(new Set(Array.from(matches, m => m[1])));
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = () => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: formData.name,
      content: formData.content,
      category: formData.category,
      language: formData.language,
      variables: extractVariables(formData.content),
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      usageCount: 0,
    };
    setTemplates([newTemplate, ...templates]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedTemplate) return;
    setTemplates(templates.map(t => 
      t.id === selectedTemplate.id 
        ? { 
            ...t, 
            name: formData.name, 
            content: formData.content,
            category: formData.category,
            language: formData.language,
            variables: extractVariables(formData.content)
          }
        : t
    ));
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedTemplate) return;
    setTemplates(templates.filter(t => t.id !== selectedTemplate.id));
    setIsDeleteOpen(false);
    setSelectedTemplate(null);
  };

  const handleDuplicate = (template: Template) => {
    const duplicated: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      usageCount: 0,
    };
    setTemplates([duplicated, ...templates]);
  };

  const openEditDialog = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      content: template.content,
      category: template.category,
      language: template.language,
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (template: Template) => {
    setSelectedTemplate(template);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      content: "",
      category: "general",
      language: "EN",
    });
    setSelectedTemplate(null);
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
              onClick={() => setIsCreateOpen(true)}
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
                className="pl-10 bg-white border-slate-200"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
          </div>
        </div>

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
                      {template.variables.map((variable) => (
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
                    Used {template.usageCount} times
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : 'Never'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(template)}
                    className="flex-1"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(template)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(template)}
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
        {filteredTemplates.length === 0 && (
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
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Message Template</DialogTitle>
              <DialogDescription>
                Create a reusable template with personalized variables
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Welcome Message"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EN">English</SelectItem>
                      <SelectItem value="ES">Spanish</SelectItem>
                      <SelectItem value="FR">French</SelectItem>
                      <SelectItem value="AR">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Message Content</Label>
                <Textarea
                  id="content"
                  placeholder="Type your message here... Use {{variableName}} for personalization"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-slate-500">
                  Tip: Use double curly braces for variables, e.g., {`{{name}}, {{orderNumber}}`}
                </p>
              </div>

              {/* Preview Variables */}
              {extractVariables(formData.content).length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-900">
                      Detected Variables:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {extractVariables(formData.content).map((variable) => (
                      <Badge key={variable} className="bg-amber-100 text-amber-800 border-amber-300">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formData.name || !formData.content}
              >
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Message Template</DialogTitle>
              <DialogDescription>
                Update your template content and settings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Template Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-language">Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger id="edit-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EN">English</SelectItem>
                      <SelectItem value="ES">Spanish</SelectItem>
                      <SelectItem value="FR">French</SelectItem>
                      <SelectItem value="AR">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Message Content</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="resize-none"
                />
              </div>

              {extractVariables(formData.content).length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-900">
                      Detected Variables:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {extractVariables(formData.content).map((variable) => (
                      <Badge key={variable} className="bg-amber-100 text-amber-800 border-amber-300">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!formData.name || !formData.content}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Template</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{selectedTemplate?.name}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
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