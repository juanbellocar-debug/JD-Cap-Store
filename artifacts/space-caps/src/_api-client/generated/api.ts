import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction, QueryFunction, QueryKey,
  UseMutationOptions, UseMutationResult,
  UseQueryOptions, UseQueryResult,
} from "@tanstack/react-query";
import type {
  AdminUser, AuthInput, AuthResponse, Brand, Cart, CartItemInput,
  DeleteProduct200, GetCartParams, HealthStatus, ListProductsParams,
  Product, ProductInput,
} from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";

type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getHealthCheckUrl = () => `/api/healthz`;
export const healthCheck = async (options?: RequestInit): Promise<HealthStatus> =>
  customFetch<HealthStatus>(getHealthCheckUrl(), { ...options, method: "GET" });
export const getHealthCheckQueryKey = () => [`/api/healthz`] as const;
export const getHealthCheckQueryOptions = <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getHealthCheckQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({ signal }) => healthCheck({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & { queryKey: QueryKey };
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
export function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getHealthCheckQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getRegisterUrl = () => `/api/auth/register`;
export const register = async (authInput: AuthInput, options?: RequestInit): Promise<AuthResponse> =>
  customFetch<AuthResponse>(getRegisterUrl(), { ...options, method: "POST", headers: { "Content-Type": "application/json", ...options?.headers }, body: JSON.stringify(authInput) });
export const getRegisterMutationOptions = <TError = ErrorType<void>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, { data: BodyType<AuthInput> }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, { data: BodyType<AuthInput> }, TContext> => {
  const mutationKey = ["register"];
  const { mutation: mutationOptions, request: requestOptions } = options ? (options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } }) : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof register>>, { data: BodyType<AuthInput> }> = (props) => { const { data } = props ?? {}; return register(data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};
export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>;
export type RegisterMutationBody = BodyType<AuthInput>;
export type RegisterMutationError = ErrorType<void>;
export const useRegister = <TError = ErrorType<void>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, { data: BodyType<AuthInput> }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationResult<Awaited<ReturnType<typeof register>>, TError, { data: BodyType<AuthInput> }, TContext> =>
  useMutation(getRegisterMutationOptions(options));

export const getLoginUrl = () => `/api/auth/login`;
export const login = async (authInput: AuthInput, options?: RequestInit): Promise<AuthResponse> =>
  customFetch<AuthResponse>(getLoginUrl(), { ...options, method: "POST", headers: { "Content-Type": "application/json", ...options?.headers }, body: JSON.stringify(authInput) });
export const getLoginMutationOptions = <TError = ErrorType<void>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, { data: BodyType<AuthInput> }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, { data: BodyType<AuthInput> }, TContext> => {
  const mutationKey = ["login"];
  const { mutation: mutationOptions, request: requestOptions } = options ? (options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } }) : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof login>>, { data: BodyType<AuthInput> }> = (props) => { const { data } = props ?? {}; return login(data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<AuthInput>;
export type LoginMutationError = ErrorType<void>;
export const useLogin = <TError = ErrorType<void>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, { data: BodyType<AuthInput> }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationResult<Awaited<ReturnType<typeof login>>, TError, { data: BodyType<AuthInput> }, TContext> =>
  useMutation(getLoginMutationOptions(options));

export const getGetMeUrl = () => `/api/auth/me`;
export const getMe = async (options?: RequestInit): Promise<AdminUser> =>
  customFetch<AdminUser>(getGetMeUrl(), { ...options, method: "GET" });
export const getGetMeQueryKey = () => [`/api/auth/me`] as const;
export const getGetMeQueryOptions = <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<void>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetMeQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMe>>> = ({ signal }) => getMe({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & { queryKey: QueryKey };
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<void>;
export function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<void>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetMeQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getListProductsUrl = (params?: ListProductsParams) => {
  const normalizedParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => { if (value !== undefined) normalizedParams.append(key, value === null ? "null" : value.toString()); });
  const stringifiedParams = normalizedParams.toString();
  return stringifiedParams.length > 0 ? `/api/products?${stringifiedParams}` : `/api/products`;
};
export const listProducts = async (params?: ListProductsParams, options?: RequestInit): Promise<Product[]> =>
  customFetch<Product[]>(getListProductsUrl(params), { ...options, method: "GET" });
export const getListProductsQueryKey = (params?: ListProductsParams) => [`/api/products`, ...(params ? [params] : [])] as const;
export const getListProductsQueryOptions = <TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(params?: ListProductsParams, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListProductsQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listProducts>>> = ({ signal }) => listProducts(params, { signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData> & { queryKey: QueryKey };
};
export type ListProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listProducts>>>;
export type ListProductsQueryError = ErrorType<unknown>;
export function useListProducts<TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(params?: ListProductsParams, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListProductsQueryOptions(params, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getCreateProductUrl = () => `/api/products`;
export const createProduct = async (productInput: ProductInput, options?: RequestInit): Promise<Product> =>
  customFetch<Product>(getCreateProductUrl(), { ...options, method: "POST", headers: { "Content-Type": "application/json", ...options?.headers }, body: JSON.stringify(productInput) });
export const getCreateProductMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProduct>>, TError, { data: BodyType<ProductInput> }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationOptions<Awaited<ReturnType<typeof createProduct>>, TError, { data: BodyType<ProductInput> }, TContext> => {
  const mutationKey = ["createProduct"];
  const { mutation: mutationOptions, request: requestOptions } = options ? (options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } }) : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof createProduct>>, { data: BodyType<ProductInput> }> = (props) => { const { data } = props ?? {}; return createProduct(data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};
export type CreateProductMutationResult = NonNullable<Awaited<ReturnType<typeof createProduct>>>;
export type CreateProductMutationBody = BodyType<ProductInput>;
export type CreateProductMutationError = ErrorType<unknown>;
export const useCreateProduct = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProduct>>, TError, { data: BodyType<ProductInput> }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationResult<Awaited<ReturnType<typeof createProduct>>, TError, { data: BodyType<ProductInput> }, TContext> =>
  useMutation(getCreateProductMutationOptions(options));

export const getGetFeaturedProductsUrl = () => `/api/products/featured`;
export const getFeaturedProducts = async (options?: RequestInit): Promise<Product[]> =>
  customFetch<Product[]>(getGetFeaturedProductsUrl(), { ...options, method: "GET" });
export const getGetFeaturedProductsQueryKey = () => [`/api/products/featured`] as const;
export const getGetFeaturedProductsQueryOptions = <TData = Awaited<ReturnType<typeof getFeaturedProducts>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProducts>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetFeaturedProductsQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getFeaturedProducts>>> = ({ signal }) => getFeaturedProducts({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProducts>>, TError, TData> & { queryKey: QueryKey };
};
export type GetFeaturedProductsQueryResult = NonNullable<Awaited<ReturnType<typeof getFeaturedProducts>>>;
export type GetFeaturedProductsQueryError = ErrorType<unknown>;
export function useGetFeaturedProducts<TData = Awaited<ReturnType<typeof getFeaturedProducts>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProducts>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetFeaturedProductsQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGetProductUrl = (id: number) => `/api/products/${id}`;
export const getProduct = async (id: number, options?: RequestInit): Promise<Product> =>
  customFetch<Product>(getGetProductUrl(id), { ...options, method: "GET" });
export const getGetProductQueryKey = (id: number) => [`/api/products/${id}`] as const;
export const getGetProductQueryOptions = <TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<void>>(id: number, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetProductQueryKey(id);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getProduct>>> = ({ signal }) => getProduct(id, { signal, ...requestOptions });
  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData> & { queryKey: QueryKey };
};
export type GetProductQueryResult = NonNullable<Awaited<ReturnType<typeof getProduct>>>;
export type GetProductQueryError = ErrorType<void>;
export function useGetProduct<TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<void>>(id: number, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetProductQueryOptions(id, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getUpdateProductUrl = (id: number) => `/api/products/${id}`;
export const updateProduct = async (id: number, productInput: ProductInput, options?: RequestInit): Promise<Product> =>
  customFetch<Product>(getUpdateProductUrl(id), { ...options, method: "PUT", headers: { "Content-Type": "application/json", ...options?.headers }, body: JSON.stringify(productInput) });
export const getUpdateProductMutationOptions = <TError = ErrorType<void>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProduct>>, TError, { id: number; data: BodyType<ProductInput> }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationOptions<Awaited<ReturnType<typeof updateProduct>>, TError, { id: number; data: BodyType<ProductInput> }, TContext> => {
  const mutationKey = ["updateProduct"];
  const { mutation: mutationOptions, request: requestOptions } = options ? (options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } }) : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateProduct>>, { id: number; data: BodyType<ProductInput> }> = (props) => { const { id, data } = props ?? {}; return updateProduct(id, data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};
export type UpdateProductMutationResult = NonNullable<Awaited<ReturnType<typeof updateProduct>>>;
export type UpdateProductMutationBody = BodyType<ProductInput>;
export type UpdateProductMutationError = ErrorType<void>;
export const useUpdateProduct = <TError = ErrorType<void>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProduct>>, TError, { id: number; data: BodyType<ProductInput> }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationResult<Awaited<ReturnType<typeof updateProduct>>, TError, { id: number; data: BodyType<ProductInput> }, TContext> =>
  useMutation(getUpdateProductMutationOptions(options));

export const getDeleteProductUrl = (id: number) => `/api/products/${id}`;
export const deleteProduct = async (id: number, options?: RequestInit): Promise<DeleteProduct200> =>
  customFetch<DeleteProduct200>(getDeleteProductUrl(id), { ...options, method: "DELETE" });
export const getDeleteProductMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProduct>>, TError, { id: number }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationOptions<Awaited<ReturnType<typeof deleteProduct>>, TError, { id: number }, TContext> => {
  const mutationKey = ["deleteProduct"];
  const { mutation: mutationOptions, request: requestOptions } = options ? (options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } }) : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteProduct>>, { id: number }> = (props) => { const { id } = props ?? {}; return deleteProduct(id, requestOptions); };
  return { mutationFn, ...mutationOptions };
};
export type DeleteProductMutationResult = NonNullable<Awaited<ReturnType<typeof deleteProduct>>>;
export type DeleteProductMutationError = ErrorType<unknown>;
export const useDeleteProduct = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProduct>>, TError, { id: number }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationResult<Awaited<ReturnType<typeof deleteProduct>>, TError, { id: number }, TContext> =>
  useMutation(getDeleteProductMutationOptions(options));

export const getListBrandsUrl = () => `/api/brands`;
export const listBrands = async (options?: RequestInit): Promise<Brand[]> =>
  customFetch<Brand[]>(getListBrandsUrl(), { ...options, method: "GET" });
export const getListBrandsQueryKey = () => [`/api/brands`] as const;
export const getListBrandsQueryOptions = <TData = Awaited<ReturnType<typeof listBrands>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof listBrands>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListBrandsQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listBrands>>> = ({ signal }) => listBrands({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof listBrands>>, TError, TData> & { queryKey: QueryKey };
};
export type ListBrandsQueryResult = NonNullable<Awaited<ReturnType<typeof listBrands>>>;
export type ListBrandsQueryError = ErrorType<unknown>;
export function useListBrands<TData = Awaited<ReturnType<typeof listBrands>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof listBrands>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListBrandsQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGetCartUrl = (params: GetCartParams) => {
  const normalizedParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => { if (value !== undefined) normalizedParams.append(key, value === null ? "null" : value.toString()); });
  const stringifiedParams = normalizedParams.toString();
  return stringifiedParams.length > 0 ? `/api/cart?${stringifiedParams}` : `/api/cart`;
};
export const getCart = async (params: GetCartParams, options?: RequestInit): Promise<Cart> =>
  customFetch<Cart>(getGetCartUrl(params), { ...options, method: "GET" });
export const getGetCartQueryKey = (params?: GetCartParams) => [`/api/cart`, ...(params ? [params] : [])] as const;
export const getGetCartQueryOptions = <TData = Awaited<ReturnType<typeof getCart>>, TError = ErrorType<unknown>>(params: GetCartParams, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetCartQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getCart>>> = ({ signal }) => getCart(params, { signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData> & { queryKey: QueryKey };
};
export type GetCartQueryResult = NonNullable<Awaited<ReturnType<typeof getCart>>>;
export type GetCartQueryError = ErrorType<unknown>;
export function useGetCart<TData = Awaited<ReturnType<typeof getCart>>, TError = ErrorType<unknown>>(params: GetCartParams, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>; request?: SecondParameter<typeof customFetch>; }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetCartQueryOptions(params, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getAddToCartUrl = () => `/api/cart`;
export const addToCart = async (cartItemInput: CartItemInput, options?: RequestInit): Promise<Cart> =>
  customFetch<Cart>(getAddToCartUrl(), { ...options, method: "POST", headers: { "Content-Type": "application/json", ...options?.headers }, body: JSON.stringify(cartItemInput) });
export const getAddToCartMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof addToCart>>, TError, { data: BodyType<CartItemInput> }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationOptions<Awaited<ReturnType<typeof addToCart>>, TError, { data: BodyType<CartItemInput> }, TContext> => {
  const mutationKey = ["addToCart"];
  const { mutation: mutationOptions, request: requestOptions } = options ? (options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } }) : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof addToCart>>, { data: BodyType<CartItemInput> }> = (props) => { const { data } = props ?? {}; return addToCart(data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};
export type AddToCartMutationResult = NonNullable<Awaited<ReturnType<typeof addToCart>>>;
export type AddToCartMutationBody = BodyType<CartItemInput>;
export type AddToCartMutationError = ErrorType<unknown>;
export const useAddToCart = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof addToCart>>, TError, { data: BodyType<CartItemInput> }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationResult<Awaited<ReturnType<typeof addToCart>>, TError, { data: BodyType<CartItemInput> }, TContext> =>
  useMutation(getAddToCartMutationOptions(options));

export const getRemoveFromCartUrl = (itemId: number) => `/api/cart/${itemId}`;
export const removeFromCart = async (itemId: number, options?: RequestInit): Promise<Cart> =>
  customFetch<Cart>(getRemoveFromCartUrl(itemId), { ...options, method: "DELETE" });
export const getRemoveFromCartMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeFromCart>>, TError, { itemId: number }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationOptions<Awaited<ReturnType<typeof removeFromCart>>, TError, { itemId: number }, TContext> => {
  const mutationKey = ["removeFromCart"];
  const { mutation: mutationOptions, request: requestOptions } = options ? (options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } }) : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof removeFromCart>>, { itemId: number }> = (props) => { const { itemId } = props ?? {}; return removeFromCart(itemId, requestOptions); };
  return { mutationFn, ...mutationOptions };
};
export type RemoveFromCartMutationResult = NonNullable<Awaited<ReturnType<typeof removeFromCart>>>;
export type RemoveFromCartMutationError = ErrorType<unknown>;
export const useRemoveFromCart = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeFromCart>>, TError, { itemId: number }, TContext>; request?: SecondParameter<typeof customFetch>; }): UseMutationResult<Awaited<ReturnType<typeof removeFromCart>>, TError, { itemId: number }, TContext> =>
  useMutation(getRemoveFromCartMutationOptions(options));
