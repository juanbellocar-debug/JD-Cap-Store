import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Product } from "./client";

/* ─── Query Keys ─────────────────────────────────────────── */

export const getListProductsQueryKey = (params?: object) => ["products", "list", params ?? {}];
export const getGetProductQueryKey = (id: number) => ["products", "detail", id];
export const getFeaturedQueryKey = () => ["products", "featured"];
export const getBrandsQueryKey = () => ["brands"];
export const getCartQueryKey = (sessionId: string) => ["cart", sessionId];
export const getGetMeQueryKey = () => ["auth", "me"];

/* ─── Store hooks ─────────────────────────────────────────── */

export function useListProducts(
  params?: { brand?: string; search?: string },
  options?: { query?: object; request?: { headers?: Record<string, string> } }
) {
  return useQuery({
    queryKey: getListProductsQueryKey(params),
    queryFn: () => api.products.list(params),
    ...(options?.query ?? {}),
  });
}

export function useGetFeaturedProducts() {
  return useQuery({
    queryKey: getFeaturedQueryKey(),
    queryFn: () => api.products.featured(),
  });
}

export function useGetProduct(
  id: number,
  options?: { query?: object }
) {
  return useQuery({
    queryKey: getGetProductQueryKey(id),
    queryFn: () => api.products.get(id),
    enabled: !!id,
    ...(options?.query ?? {}),
  });
}

export function useListBrands() {
  return useQuery({
    queryKey: getBrandsQueryKey(),
    queryFn: () => api.brands.list(),
  });
}

export function useGetCart(
  params: { sessionId: string },
  options?: { query?: object }
) {
  return useQuery({
    queryKey: getCartQueryKey(params.sessionId),
    queryFn: () => api.cart.get(params.sessionId),
    enabled: !!params.sessionId,
    ...(options?.query ?? {}),
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { data: { sessionId: string; productId: number; quantity: number } }) =>
      api.cart.add(vars.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: getCartQueryKey(vars.data.sessionId) });
    },
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId }: { itemId: number }) => api.cart.remove(itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

/* ─── Auth hooks ──────────────────────────────────────────── */

export function useLogin() {
  return useMutation({
    mutationFn: (vars: { data: { email: string; password: string } }) =>
      api.auth.login(vars.data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (vars: { data: { email: string; password: string } }) =>
      api.auth.register(vars.data),
  });
}

export function useGetMe(options?: {
  query?: object;
  request?: { headers?: Record<string, string> };
}) {
  const token = (options?.request?.headers?.Authorization ?? "").replace("Bearer ", "");
  return useQuery({
    queryKey: getGetMeQueryKey(),
    queryFn: () => api.auth.me(token),
    enabled: !!token,
    ...(options?.query ?? {}),
  });
}

/* ─── Admin product mutations ─────────────────────────────── */

export function useCreateProduct(opts?: { request?: { headers?: Record<string, string> } }) {
  const qc = useQueryClient();
  const token = (opts?.request?.headers?.Authorization ?? "").replace("Bearer ", "");
  return useMutation({
    mutationFn: ({ data }: { data: Partial<Product> }) => api.products.create(data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct(opts?: { request?: { headers?: Record<string, string> } }) {
  const qc = useQueryClient();
  const token = (opts?.request?.headers?.Authorization ?? "").replace("Bearer ", "");
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      api.products.update(id, data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct(opts?: { request?: { headers?: Record<string, string> } }) {
  const qc = useQueryClient();
  const token = (opts?.request?.headers?.Authorization ?? "").replace("Bearer ", "");
  return useMutation({
    mutationFn: ({ id }: { id: number }) => api.products.delete(id, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
