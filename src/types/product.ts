export type ProductCategory = "pillow" | "accessory";

export interface ProductVariantOption {
  id: string;
  label: string;
  priceDelta: number;
  swatchHex?: string;
  swatchImage?: string;
}

export interface ProductVariantGroup {
  id: string;
  label: string;
  required: boolean;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  basePrice: number;
  images: string[];
  shortDescription: string;
  description: string;
  variantGroups: ProductVariantGroup[];
  careNotes: string;
  shippingNotes: string;
  featured?: boolean;
}

