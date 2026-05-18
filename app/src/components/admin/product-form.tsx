import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct, useUpdateProduct, getListProductsQueryKey } from "@/api/hooks";
import { useAuth } from "./auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  imageBackUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
}

export function ProductForm({ open, onOpenChange, product }: ProductFormProps) {
  const { getAuthHeaders } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const isEdit = !!product;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      price: 0,
      imageUrl: "",
      imageBackUrl: "",
      description: "",
      available: true,
      featured: false,
    }
  });

  useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          name: product.name,
          brand: product.brand,
          price: product.price,
          imageUrl: product.imageUrl || "",
          imageBackUrl: product.imageBackUrl || "",
          description: product.description || "",
          available: product.available,
          featured: product.featured || false,
        });
      } else {
        form.reset({
          name: "",
          brand: "",
          price: 0,
          imageUrl: "",
          imageBackUrl: "",
          description: "",
          available: true,
          featured: false,
        });
      }
    }
  }, [open, product, form]);

  const createMutation = useCreateProduct({ request: { headers: getAuthHeaders() } });
  const updateMutation = useUpdateProduct({ request: { headers: getAuthHeaders() } });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      imageUrl: data.imageUrl || undefined,
      imageBackUrl: data.imageBackUrl || null,
      description: data.description || null,
    };

    if (isEdit) {
      updateMutation.mutate({ id: product.id, data: payload }, {
        onSuccess: () => {
          toast({ title: "Asset updated", description: "Changes have been persisted." });
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          onOpenChange(false);
        },
        onError: () => {
          toast({ title: "System Error", description: "Could not persist changes.", variant: "destructive" });
        }
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Asset initialized", description: "New product deployed to catalog." });
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          onOpenChange(false);
        },
        onError: () => {
          toast({ title: "System Error", description: "Could not initialize asset.", variant: "destructive" });
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] dark bg-card border-border/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{isEdit ? "Update Parameter" : "Initialize Asset"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit ? "Modify existing asset attributes." : "Define a new product for the catalog network."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="Cap Name" {...field} className="bg-input/50 border-border/50 focus-visible:ring-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Origin (Brand)</FormLabel>
                    <FormControl>
                      <Input placeholder="Brand Name" {...field} className="bg-input/50 border-border/50 focus-visible:ring-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Exchange Rate ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} className="bg-input/50 border-border/50 focus-visible:ring-primary w-[160px] font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Specifications</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product details..." {...field} className="bg-input/50 border-border/50 focus-visible:ring-primary resize-none h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 border border-border/30 rounded-lg p-5 bg-background shadow-inner">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Visual Telemetry</h4>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Primary Feed URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} className="bg-input/50 border-border/50 focus-visible:ring-primary font-mono text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageBackUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Secondary Feed URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} className="bg-input/50 border-border/50 focus-visible:ring-primary font-mono text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4 w-full bg-background shadow-sm">
                    <div className="space-y-1">
                      <FormLabel className="text-sm font-semibold">Active Network</FormLabel>
                      <p className="text-xs text-muted-foreground">Asset available in storefront</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4 w-full bg-background shadow-sm">
                    <div className="space-y-1">
                      <FormLabel className="text-sm font-semibold">Priority Display</FormLabel>
                      <p className="text-xs text-muted-foreground">Highlight on main broadcast</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4 border-t border-border/50 mt-6">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-muted/50">Cancel</Button>
              <Button type="submit" disabled={isPending} className="font-semibold shadow-md min-w-[120px]">
                {isPending ? "Transmitting..." : isEdit ? "Commit" : "Deploy"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
