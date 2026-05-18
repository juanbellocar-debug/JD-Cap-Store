import { useState, useMemo } from "react";
import { Layout } from "@/components/admin/layout";
import { useAuth } from "@/components/admin/auth-provider";
import { useListProducts, getListProductsQueryKey, useDeleteProduct, useUpdateProduct } from "@/api/hooks";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit2, Trash2, Package } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Redirect } from "wouter";

function DashboardContent() {
  const { getAuthHeaders } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { data: products = [], isLoading } = useListProducts(
    {},
    { request: { headers: getAuthHeaders() }, query: { queryKey: getListProductsQueryKey({}) } }
  );

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const deleteMutation = useDeleteProduct({ request: { headers: getAuthHeaders() } });
  const updateMutation = useUpdateProduct({ request: { headers: getAuthHeaders() } });

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Product purged", description: "The asset has been removed from the catalog." });
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      },
      onError: () => {
        toast({ title: "System Error", description: "Failed to purge product.", variant: "destructive" });
      }
    });
  };

  const handleToggle = (id: number, field: 'available' | 'featured', currentValue: boolean, productData: any) => {
    updateMutation.mutate({
      id,
      data: { ...productData, [field]: !currentValue }
    }, {
      onSuccess: () => {
        toast({ title: "Status updated", description: `Asset ${field} status modified.` });
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      },
      onError: () => {
        toast({ title: "System Error", description: "Failed to update status.", variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Catalog Control</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage global product inventory and visibility settings.</p>
          </div>
          <Button onClick={() => { setEditingProduct(null); setIsFormOpen(true); }} className="gap-2 font-semibold shadow-md">
            <Plus className="w-4 h-4" /> Initialize Asset
          </Button>
        </div>

        <div className="flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search designation or origin..."
              className="pl-9 bg-card border-border/50 shadow-sm focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="border border-border/50 rounded-lg bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[80px] font-medium text-muted-foreground uppercase text-xs tracking-wider">Preview</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Asset Specs</TableHead>
                <TableHead className="w-[120px] font-medium text-muted-foreground uppercase text-xs tracking-wider">Exchange</TableHead>
                <TableHead className="w-[120px] text-center font-medium text-muted-foreground uppercase text-xs tracking-wider">Active</TableHead>
                <TableHead className="w-[120px] text-center font-medium text-muted-foreground uppercase text-xs tracking-wider">Featured</TableHead>
                <TableHead className="text-right w-[100px] font-medium text-muted-foreground uppercase text-xs tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Fetching telemetry...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No assets found matching operational criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="group border-border/50 hover:bg-muted/10 transition-colors">
                    <TableCell>
                      <div className="w-12 h-12 rounded bg-background flex items-center justify-center overflow-hidden border border-border/50 shadow-sm">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground tracking-tight">{product.name}</div>
                      <div className="text-xs text-muted-foreground/80 font-mono mt-0.5">{product.brand}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      ${(product.price).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={product.available}
                        onCheckedChange={() => handleToggle(product.id, 'available', product.available, product)}
                        className="data-[state=checked]:bg-primary shadow-sm"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={product.featured || false}
                        onCheckedChange={() => handleToggle(product.id, 'featured', product.featured || false, product)}
                        className="data-[state=checked]:bg-primary shadow-sm"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => { setEditingProduct(product); setIsFormOpen(true); }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="dark bg-card border-border shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Execute Purge?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will permanently remove <span className="font-semibold text-foreground">{product.name}</span> from the catalog. This action cannot be reversed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-border/50">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md">
                                Execute
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={editingProduct}
      />
    </Layout>
  );
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect to="/admin" />;
  return <DashboardContent />;
}
