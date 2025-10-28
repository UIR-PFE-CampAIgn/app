"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { useBusinesses } from "@/lib/hooks/useBusinesses";
import { toast } from "react-toastify";
import {
  businessFormSchema,
  type BusinessFormValues,
} from "@/lib/validators/business.validator";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const industries = [
  "Technology",
  "Retail",
  "Food & Beverage",
  "Health & Wellness",
  "Real Estate",
  "Marketing",
  "Finance",
  "Education",
  "Entertainment",
  "Manufacturing",
  "Construction",
  "Transportation",
  "Hospitality",
  "Other",
];

export default function BusinessSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { business, loading, error, refetch } = useBusiness(id);
  const { updateBusiness, deleteBusiness } = useBusinesses();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: "",
      industry: "",
      description: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Populate form when business data loads
  useEffect(() => {
    if (business) {
      form.reset({
        name: business.name,
        industry: business.industry,
        description: business.description,
        email: business.email || "",
        phone: business.phone || "",
        address: business.address || "",
      });
    }
    console.log(business,"bssisisi")
  }, [business, form]);

  const handleSave = async (values: BusinessFormValues) => {
    try {
      setIsSaving(true);
      const result = await updateBusiness(id, values);
      if (result) {
        toast.success("Business settings updated successfully");
        await refetch();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update business");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const success = await deleteBusiness(id);
      if (success) {
        toast.success("Business deleted successfully");
        router.push("/dashboard/business");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete business");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Error Loading Business</h3>
          <p className="text-muted-foreground">{error || "Business not found"}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
          <Button onClick={() => router.push("/dashboard/business")} variant="ghost">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/business/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Business Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your business profile and information
              </p>
            </div>
          </div>
        </div>
        <Badge variant={business.is_active ? "default" : "secondary"} className="capitalize">
          {business.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <Separator />

      {/* Business Information Form */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Information
          </CardTitle>
          <CardDescription>
            Update your business details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  Basic Information
                </h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Tech Startup Inc" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name that will be displayed to your customers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the industry that best describes your business
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of your business..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short description to help customers understand your business
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contact@business.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

               

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="123 Business St, City, State, ZIP"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/business/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that can affect your business data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Delete Business</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete this business and all associated data including campaigns, leads, and templates.
              </p>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Business Stats Footer */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{business.campaigns || 0}</p>
              <p className="text-xs text-muted-foreground">Campaigns</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{business.Leads || 0}</p>
              <p className="text-xs text-muted-foreground">Leads</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {business.created_at ? new Date(business.created_at).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">Created</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {business.updated_at ? new Date(business.updated_at).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">Last Updated</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Business</DialogTitle>
            <DialogDescription asChild>
              <div>
                <p>
                  Are you absolutely sure you want to delete <strong>{business.name}</strong>?
                </p>
                <p className="mt-2">
                  This action cannot be undone. This will permanently delete all associated data including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>All campaigns</li>
                  <li>All leads and conversations</li>
                  <li>All templates</li>
                  <li>All analytics data</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Business"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}