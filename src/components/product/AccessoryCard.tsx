import type { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";

export function AccessoryCard({ product }: { product: Product }) {
  return <ProductCard product={product} />;
}
