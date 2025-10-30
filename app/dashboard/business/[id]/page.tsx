"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  Users,
  TrendingUp,
  Settings,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useTemplates } from "@/lib/hooks/use-templates";
import { useTemplateDialog } from "@/lib/hooks/use-template-dialog";
import { ALLOWED_VARIABLE_KEYS, ALLOWED_VARIABLES } from "@/lib/constants/template-variables";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

export default function BusinessDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { business, loading, error, refetch } = useBusiness(id);
  const { createTemplate, updateTemplate } = useTemplates();
  const { isCreateOpen, isEditOpen, openCreate, openEdit, closeDialogs } = useTemplateDialog();

  // Form state
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"onboarding" | "general" | "transactional" | "follow-up" | "promotional">("onboarding");
  const [language, setLanguage] = useState("EN");


  const handleViewAllCampaigns = () => {
    router.push(`/dashboard/business/${business?._id}/campaigns`);
  };
  const handleViewSettings = () => {
    router.push(`/dashboard/business/${business?._id}/settings`);
  };
  // Default welcome message
  const getDefaultWelcomeMessage = useCallback(() => {
    return `Hello! 👋\n\nWelcome to ${business?.name}! We're excited to have you here.\n\n${business?.description || "We're dedicated to providing you with the best service possible."}\n\nHow can we help you today? Feel free to ask any questions, and we'll get back to you right away!`;
  }, [business]);

  // Open dialog handler
  const handleEditClick = () => {
    if (business?.welcomeTemplate) {
      openEdit(business.welcomeTemplate as never);
    } else {
      openCreate();
    }
  };

  // Initialize form when dialog opens
  useEffect(() => {
    if (isCreateOpen || isEditOpen) {
      if (business?.welcomeTemplate && isEditOpen) {
        setName(business.welcomeTemplate.name);
        setContent(business.welcomeTemplate.content);
        setCategory(business.welcomeTemplate.category as never);
        setLanguage(business.welcomeTemplate.language);
      } else if (isCreateOpen) {
        setName("Welcome Message");
        setContent(getDefaultWelcomeMessage());
        setCategory("onboarding");
        setLanguage("EN");
      }
    }
  }, [isCreateOpen, isEditOpen, business, getDefaultWelcomeMessage]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isCreateOpen && !isEditOpen) {
      setName("");
      setContent("");
      setCategory("general");
      setLanguage("EN");
    }
  }, [isCreateOpen, isEditOpen]);

  // Save handler using hooks only
  const handleSave = async () => {
    if (!name || !content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSaving(true);
      const templateData = {
        name,
        content,
        category,
        language,
        template_key: "WELCOME_MESSAGE",
        business_id: id,
      };
      
      if (business?.welcomeTemplate && isEditOpen) {
        await updateTemplate(business.welcomeTemplate.id, templateData);
        toast.success("Welcome message updated successfully");
      } else {
        await createTemplate(templateData);
        toast.success("Welcome message created successfully");
      }

      await refetch();
      closeDialogs();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save welcome message"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Extract variables using existing constants (no service call)
  const extractVariables = (text: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = text.matchAll(regex);
    return Array.from(matches, m => m[1]);
  };

  const detectedVars = extractVariables(content || "");
  const validVars = detectedVars.filter((v) =>
    ALLOWED_VARIABLE_KEYS.includes(v as (typeof ALLOWED_VARIABLE_KEYS)[number])
  );
  const invalidVars = detectedVars.filter(
    (v) => !ALLOWED_VARIABLE_KEYS.includes(v as (typeof ALLOWED_VARIABLE_KEYS)[number])
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive">{error || "Business not found"}</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/business">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {business.name}
            </h1>
            <Badge variant="secondary" className="capitalize">
              {business.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {business.description || "No description available"}
          </p>
        </div>
        <Button variant="outline" onClick={handleViewSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {business.campaigns || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Running campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Leads
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {business.Leads || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Captured leads</p>
          </CardContent>
        </Card>

        

       
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Message</CardTitle>
            <CardDescription>Automated greeting for new leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4 space-y-3">
              {business.welcomeTemplate ? (
                <>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {business.welcomeTemplate.content}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-foreground font-medium">Hello! 👋</p>
                  <p className="text-sm text-foreground">
                    Welcome to <span className="font-semibold">{business.name}</span>!
                    We&apos;re excited to have you here.
                  </p>
                  <p className="text-sm text-foreground">
                    {business.description || "We're dedicated to providing you with the best service possible."}
                  </p>
                  <p className="text-sm text-foreground">
                    How can we help you today? Feel free to ask any questions, and
                    we&apos;ll get back to you right away!
                  </p>
                </>
              )}
            </div>
            <Button 
              className="w-full mt-4 bg-transparent" 
              variant="outline"
              onClick={handleEditClick}
            >
              {business.welcomeTemplate ? 'Edit Welcome Message' : 'Customize Welcome Message'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Latest campaign activity</CardDescription>
          </CardHeader>
          <CardContent>
            {business.recentCampaigns && business.recentCampaigns.length > 0 ? (
              <>
                <div className="space-y-4">
                  {business.recentCampaigns.map((campaign) => (
                    <div
                      key={campaign._id}
                      className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground">
                            {campaign.name}
                          </p>
                          <Badge
                            variant={
                              campaign.status === "running" ||
                              campaign.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs capitalize"
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {campaign.total_recipients} recipients •{" "}
                          {campaign.sent_count} sent
                        </p>
                      </div>
                      <Button variant="ghost" size="sm"   onClick={handleViewAllCampaigns}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline"  onClick={handleViewAllCampaigns}
                >
                  View All Campaigns
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No campaigns yet</p>
                <Button variant="outline">Create Campaign</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message Dialog - Inside the page, using hooks only */}
      <Dialog open={isCreateOpen || isEditOpen} onOpenChange={closeDialogs}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {isEditOpen ? "Edit" : "Create"} Welcome Message
            </DialogTitle>
            <DialogDescription>
              {isEditOpen
                ? "Update your template content and settings"
                : "Create a reusable template with personalized variables"}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto px-1 space-y-4 py-2">
            {/* Available Variables Section */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                    onClick={() => setContent(content + `{{${variable.key}}}`)}
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

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Welcome Message"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory as never}>
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

                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
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

              <div className="grid gap-2">
                <Label htmlFor="content">Message Content</Label>
                <Textarea
                  id="content"
                  placeholder="Type your message here... Use {{variableName}} for personalization"
                  rows={6}
                  className="resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use double curly braces for variables. Only predefined variables
                  are allowed.
                </p>
              </div>

              {/* Preview Variables */}
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
                      <Badge
                        key={variable}
                        className="bg-green-100 text-green-800 border-green-300"
                      >
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
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialogs}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !name || !content}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditOpen ? (
                "Save Changes"
              ) : (
                "Create Template"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}