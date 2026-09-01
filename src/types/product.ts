export type ProductCategory = "pillow" | "accessory";

export interface ProductVariantOption {
  id: string;
  label: string;
  /** cents, added on top of the base price */
  priceDelta: number;
  swatchHex?: string;
  swatchImage?: string;
}

export interface ProductVariantGroup {
  id: string; // e.g. "fabric", "size"
  label: string;
  required: boolean;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  /** cents */
  basePrice: number;
  images: string[];
  shortDescription: string;
  description: string;
  variantGroups: ProductVariantGroup[];
  careNotes: string;
  shippingNotes: string;
  featured?: boolean;
}
