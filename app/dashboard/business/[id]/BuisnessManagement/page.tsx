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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Building2,
  Package,
  MapPin,
  Globe,
  Mail,
  Phone,
  Edit,
  Plus,
  Trash2,
  ArrowLeft,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter , useSearchParams} from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { useProducts } from "@/lib/hooks/use-products";
import { useProductDialog } from "@/lib/hooks/use-product-dialog";
import { productFormSchema, type ProductFormValues } from "@/lib/validators/products.validator";
import { toast } from "react-toastify";

export default function BusinessManagementPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const searchParams = useSearchParams();

// get current tab from URL or default to 'overview'
const currentTab = searchParams.get("tab") || "overview";

const handleTabChange = (value: string) => {
  router.replace(`?tab=${value}`); // updates the URL without page reload
};


  const { business, loading: businessLoading } = useBusiness(id);
  const {
    products,
    loading: productsLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  
  const {
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    selectedProduct,
    openCreate,
    openEdit,
    openDelete,
    closeDialogs,
  } = useProductDialog();

  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      currency: "USD",
      description: "",
      sku: "",
      stock: 0,
      category: "",
    },
  });

  // Fetch products when business is loaded
  useEffect(() => {
    if (business?._id) {
      fetchProducts({ businessId: business._id });
    }
  }, [business?._id, fetchProducts]);

  // Initialize form for create
  useEffect(() => {
    if (isCreateOpen) {
      form.reset({
        name: "",
        price: 0,
        currency: "USD",
        description: "",
        sku: "",
        stock: 0,
        category: "",
      });
     
    }
  }, [isCreateOpen, form]);

  // Initialize form for edit
  useEffect(() => {
    if (isEditOpen && selectedProduct) {
      form.reset({
        name: selectedProduct.name,
        price: selectedProduct.price,
        currency: selectedProduct.currency,
        description: selectedProduct.description || "",
        sku: selectedProduct.sku || "",
        stock: selectedProduct.stock,
        category: selectedProduct.category || "",
      });
      
    }
  }, [isEditOpen, selectedProduct, form]);

  // Reset when dialogs close
  useEffect(() => {
    if (!isCreateOpen && !isEditOpen && !isDeleteOpen) {
      form.reset();
      
    }
  }, [isCreateOpen, isEditOpen, isDeleteOpen, form]);

 


  // Handle create
  const handleCreate = async (values: ProductFormValues) => {
    if (!business?._id) return;

    try {
      setIsSaving(true);
      await createProduct({
        ...values,
        business_id: business._id,
      });

      toast.success("Product created successfully");
      closeDialogs();
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle update
  const handleUpdate = async (values: ProductFormValues) => {
    if (!selectedProduct) return;

    try {
      setIsSaving(true);
      
      await updateProduct(selectedProduct.id, {
        ...values,
      });

      toast.success("Product updated successfully");
      closeDialogs();
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      setIsSaving(true);
      await deleteProduct(selectedProduct.id);
      toast.success("Product deleted successfully");
      closeDialogs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setIsSaving(false);
    }
  };

  if (businessLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/business">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  Business Information
                </h1>
                <p className="text-muted-foreground text-sm">
                  Manage your business profile, products, and services
                </p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="capitalize">
            {business?.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-white border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Business Details</CardTitle>
                  <CardDescription>Your business information and contact details</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/business/${id}/settings`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">{business?.name}</h3>
                      <p className="text-sm text-muted-foreground">{business?.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Industry:</span>
                        <span className="font-medium">{business?.industry}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{business?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{business?.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{business?.website}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{business?.address}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-white border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Products Listed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active products</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="bg-white border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Products & Services</CardTitle>
                  <CardDescription>
                    Manage your product catalog and service offerings
                  </CardDescription>
                </div>
                <Button onClick={openCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : products.length > 0 ? (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex-1">
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {product.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-lg font-bold text-primary">
                                {product.currency} {product.price}
                              </span>
                              <Badge variant="secondary">Stock: {product.stock}</Badge>
                              {product.category && (
                                <Badge variant="outline">{product.category}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => openDelete(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      No products yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding your first product or service
                    </p>
                    <Button onClick={openCreate}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create/Edit Product Dialog */}
        {(isCreateOpen || isEditOpen) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {isEditOpen ? "Edit" : "Create"} Product
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isEditOpen
                        ? "Update product information"
                        : "Add a new product to your catalog"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeDialogs}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <form
                onSubmit={form.handleSubmit(isEditOpen ? handleUpdate : handleCreate)}
                className="p-6 space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Premium Plan"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="99.99"
                      {...form.register("price", { valueAsNumber: true })}
                    />
                    {form.formState.errors.price && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.price.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      placeholder="USD"
                      {...form.register("currency")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      {...form.register("stock", { valueAsNumber: true })}
                    />
                    {form.formState.errors.stock && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.stock.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" placeholder="SKU-001" {...form.register("sku")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Software"
                      {...form.register("category")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product..."
                    rows={3}
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : isEditOpen ? (
                      "Save Changes"
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeDialogs}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {isDeleteOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-2">Delete Product</h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete &quot;{selectedProduct?.name}&quot;? This
                action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={closeDialogs}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}