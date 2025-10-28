"use client";

import { useEffect } from "react";
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
import { Building2, Plus, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useBusinesses } from "@/lib/hooks/useBusinesses";
import { useBusinessDialog } from "@/lib/hooks/use-business-dialog";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";
import {
  businessFormSchema,
  defaultBusinessFormValues,
  type BusinessFormValues,
} from "@/lib/validators/business.validator";

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

export default function BusinessesPage() {
  const {
    businesses,
    loading,
    error,
    refetch,
    createBusiness,
  } = useBusinesses();

  const {
    isCreateOpen,
    openCreate,
    closeDialogs,
  } = useBusinessDialog();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: defaultBusinessFormValues,
  });

  // Reset form when create dialog opens
  useEffect(() => {
    if (isCreateOpen) {
      form.reset(defaultBusinessFormValues);
    }
  }, [isCreateOpen, form]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isCreateOpen) {
      form.reset(defaultBusinessFormValues);
    }
  }, [isCreateOpen, form]);

  const handleCreate = async (values: BusinessFormValues) => {
    try {
      const result = await createBusiness(values);
      if (result) {
        closeDialogs();
        form.reset(defaultBusinessFormValues);
        toast.success("Business created successfully");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create business");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Businesses
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all your business accounts and campaigns
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Businesses
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all your business accounts and campaigns
            </p>
          </div>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error}</p>
            <div className="flex justify-center mt-4">
              <Button onClick={refetch} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Businesses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all your business accounts and campaigns
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Business
        </Button>
      </div>

      {businesses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No businesses yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first business
              </p>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Business
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Card
              key={business._id}
              className="h-full hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {business.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {business.industry}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {business.description}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-border mb-4">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {business.campaigns || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Campaigns</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {business.Leads || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/dashboard/business/${business._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowRight className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Business Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={closeDialogs}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add New Business</DialogTitle>
            <DialogDescription>
              Create a new business profile to manage campaigns and leads
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto px-1 space-y-4 py-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreate)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Tech Startup Inc" {...field} />
                      </FormControl>
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
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
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
                        <FormLabel>Phone</FormLabel>
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
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://business.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="123 Business St, City, State, ZIP"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeDialogs}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Business</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}