export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  imageBackUrl: string | null;
  description: string | null;
  available: boolean;
  featured: boolean;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export interface CartItemEntry {
  id: number;
  productId: number;
  quantity: number;
  productName: string;
  productBrand: string;
  price: number;
  imageUrl: string;
}

export interface CartResponse {
  sessionId: string;
  items: CartItemEntry[];
  total: number;
}

export interface AuthResponse {
  token: string;
  user: { id: number; email: string };
}

export interface User {
  id: number;
  email: string;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      msg = JSON.parse(text).error ?? text;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  products: {
    list: (params?: { brand?: string; search?: string }) => {
      const q = new URLSearchParams(
        Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v != null)) as Record<string, string>
      ).toString();
      return apiFetch<Product[]>(`/products${q ? `?${q}` : ""}`);
    },
    featured: () => apiFetch<Product[]>("/products/featured"),
    get: (id: number) => apiFetch<Product>(`/products/${id}`),
    create: (data: Partial<Product>, token: string) =>
      apiFetch<Product>("/products", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { Authorization: `Bearer ${token}` },
      }),
    update: (id: number, data: Partial<Product>, token: string) =>
      apiFetch<Product>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { Authorization: `Bearer ${token}` },
      }),
    delete: (id: number, token: string) =>
      apiFetch<{ success: boolean }>(`/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
  },
  brands: {
    list: () => apiFetch<Brand[]>("/brands"),
  },
  auth: {
    login: (data: { email: string; password: string }) =>
      apiFetch<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    register: (data: { email: string; password: string }) =>
      apiFetch<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    me: (token: string) =>
      apiFetch<User>("/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
  },
  cart: {
    get: (sessionId: string) => apiFetch<CartResponse>(`/cart?sessionId=${encodeURIComponent(sessionId)}`),
    add: (data: { sessionId: string; productId: number; quantity: number }) =>
      apiFetch<CartResponse>("/cart", { method: "POST", body: JSON.stringify(data) }),
    remove: (itemId: number) =>
      apiFetch<CartResponse>(`/cart/${itemId}`, { method: "DELETE" }),
  },
};
