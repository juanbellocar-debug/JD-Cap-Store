import * as zod from "zod";

export const HealthCheckResponse = zod.object({
  status: zod.string(),
});

export const registerBodyPasswordMin = 6;
export const RegisterBody = zod.object({
  email: zod.string().email(),
  password: zod.string().min(registerBodyPasswordMin),
});

export const loginBodyPasswordMin = 6;
export const LoginBody = zod.object({
  email: zod.string().email(),
  password: zod.string().min(loginBodyPasswordMin),
});

export const ListProductsQueryParams = zod.object({
  brand: zod.coerce.string().optional(),
  search: zod.coerce.string().optional(),
});

export const CreateProductBody = zod.object({
  name: zod.string(),
  brand: zod.string(),
  price: zod.number(),
  imageUrl: zod.string().optional(),
  imageBackUrl: zod.string().nullish(),
  description: zod.string().nullish(),
  available: zod.boolean().optional(),
  featured: zod.boolean().optional(),
});

export const GetProductParams = zod.object({
  id: zod.coerce.number(),
});

export const UpdateProductParams = zod.object({
  id: zod.coerce.number(),
});

export const UpdateProductBody = zod.object({
  name: zod.string().optional(),
  brand: zod.string().optional(),
  price: zod.number().optional(),
  imageUrl: zod.string().optional(),
  imageBackUrl: zod.string().nullish(),
  description: zod.string().nullish(),
  available: zod.boolean().optional(),
  featured: zod.boolean().optional(),
});

export const DeleteProductParams = zod.object({
  id: zod.coerce.number(),
});

export const GetCartQueryParams = zod.object({
  sessionId: zod.coerce.string(),
});

export const AddToCartBody = zod.object({
  sessionId: zod.string(),
  productId: zod.number(),
  quantity: zod.number(),
});

export const RemoveFromCartParams = zod.object({
  itemId: zod.coerce.number(),
});
