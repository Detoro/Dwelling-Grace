import type { Product, ProductCategory } from "../types/product";
import { api } from "./client";

export async function fetchProducts(category?: ProductCategory): Promise<Product[]> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await api.get<Product[]>(`/products${qs}`);
  return Array.isArray(res) ? res : [];
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  return await api.get<Product>(`/products/${encodeURIComponent(slug)}`);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>("/products?featured=true");
  return Array.isArray(res) ? res : [];
}