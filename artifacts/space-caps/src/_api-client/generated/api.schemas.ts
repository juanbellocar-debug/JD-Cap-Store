export interface HealthStatus { status: string; }
export interface AuthInput { email: string; password: string; }
export interface AdminUser { id: number; email: string; }
export interface AuthResponse { token: string; user: AdminUser; }
export interface Product {
  id: number; name: string; brand: string; price: number;
  imageUrl: string; imageBackUrl?: string | null; description?: string | null;
  available: boolean; featured?: boolean;
}
export interface ProductInput {
  name: string; brand: string; price: number; imageUrl?: string;
  imageBackUrl?: string | null; description?: string | null;
  available?: boolean; featured?: boolean;
}
export interface Brand { id: number; name: string; slug: string; logoUrl?: string | null; }
export interface CartItem {
  id: number; productId: number; productName: string; productBrand: string;
  price: number; quantity: number; imageUrl: string;
}
export interface Cart { sessionId: string; items: CartItem[]; total: number; }
export interface CartItemInput { sessionId: string; productId: number; quantity: number; }
export type ListProductsParams = { brand?: string; search?: string; };
export type DeleteProduct200 = { success: boolean; };
export type GetCartParams = { sessionId: string; };
