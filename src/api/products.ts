import type { Product, ProductCategory } from "../types/product";
import { api } from "./client";
import heroImage from "../assets/hero.png";

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod-pillow-hearth",
    slug: "hearth-pillow",
    name: "Hearth Pillow",
    category: "pillow",
    basePrice: 1899,
    images: [`${import.meta.env.BASE_URL}pillow__black/textures/Material_baseColor.png`],
    shortDescription: "Our signature made-to-order square pillow in Belgian linen and velvet.",
    description:
      "A simple, well-proportioned square pillow built the same way we build every piece — cut and stitched to order, in small batches, from fabric we keep on hand in the workroom.",
    variantGroups: [
      {
        id: "fabric",
        label: "Fabric",
        required: true,
        options: [
          { id: "linen-oat", label: "Oat Linen", priceDelta: 0, swatchHex: "#D8CCB4" },
          { id: "linen-clay", label: "Clay Linen", priceDelta: 0, swatchHex: "#B97D5D" },
          { id: "velvet-wine", label: "Wine Velvet", priceDelta: 2200, swatchHex: "#5C1F2E" },
          { id: "velvet-moss", label: "Moss Velvet", priceDelta: 2200, swatchHex: "#3E4A34" },
          { id: "silk-gold", label: "Gold Silk", priceDelta: 4800, swatchHex: "#C7A24C" },
        ],
      },
      {
        id: "size",
        label: "Size",
        required: true,
        options: [
          { id: "18x18", label: '18" × 18"', priceDelta: 0 },
          { id: "20x20", label: '20" × 20"', priceDelta: 800 },
          { id: "24x24", label: '24" × 24"', priceDelta: 1100 }
        ],
      },
    ],
    careNotes: "Spot clean with a damp cloth. Dry clean only for velvet and silk covers.",
    shippingNotes: "Made to order — ships in 2–3 weeks. Free shipping over $150.",
    featured: true,
  },
  {
    id: "prod-pillow-orchard",
    slug: "orchard-lumbar-pillow",
    name: "Orchard Lumbar Pillow",
    category: "pillow",
    basePrice: 1899,
    images: [heroImage],
    shortDescription: "A long lumbar shape for a reading chair or deep window seat.",
    description:
      "Built on the same frame as the Hearth Pillow but cut long and narrow — made for the small of your back on a deep chair, or laid flat along a windowsill.",
    variantGroups: [
      {
        id: "fabric",
        label: "Fabric",
        required: true,
        options: [
          { id: "linen-oat", label: "Oat Linen", priceDelta: 0, swatchHex: "#D8CCB4" },
          { id: "linen-clay", label: "Clay Linen", priceDelta: 0, swatchHex: "#B97D5D" },
          { id: "velvet-wine", label: "Wine Velvet", priceDelta: 1100, swatchHex: "#5C1F2E" },
        ],
      },
      {
        id: "piping",
        label: "Piping",
        required: false,
        options: [
          { id: "piping-none", label: "No piping", priceDelta: 0 },
          { id: "piping-contrast", label: "Contrast piping", priceDelta: 900, swatchHex: "#C7A24C" },
        ],
      },
    ],
    careNotes: "Spot clean with a damp cloth. Dry clean only for velvet covers.",
    shippingNotes: "Made to order — ships in 2–3 weeks. Free shipping over $150.",
    featured: true,
  },
  {
    id: "prod-case-standard",
    slug: "everyday-pillowcase-set",
    name: "Everyday Pillowcase Set",
    category: "pillow",
    basePrice: 1899,
    images: [heroImage],
    shortDescription: "A set of two covers, tailored in matching natural flax linen.",
    description:
      "The same linen and velvet as the rest of the collection, cut into a simple envelope-back case. Sold as a set of two.",
    variantGroups: [
      {
        id: "fabric",
        label: "Fabric",
        required: true,
        options: [
          { id: "linen-oat", label: "Oat Linen", priceDelta: 0, swatchHex: "#D8CCB4" },
          { id: "linen-clay", label: "Clay Linen", priceDelta: 0, swatchHex: "#B97D5D" },
        ],
      },
      {
        id: "size",
        label: "Size",
        required: true,
        options: [
          { id: "standard", label: 'Standard (20" × 26")', priceDelta: 0 },
          { id: "queen", label: 'Queen (20" × 30")', priceDelta: 400 },
          { id: "king", label: 'King (20" × 36")', priceDelta: 800 },
        ],
      },
    ],
    careNotes: "Machine wash cold on gentle cycle, tumble dry low.",
    shippingNotes: "Made to order — ships in 2–3 weeks. Free shipping over $150.",
    featured: false,
  },
  {
    id: "prod-accessory-insert",
    slug: "feather-down-insert",
    name: "Feather-Down Insert",
    category: "accessory",
    basePrice: 2600,
    images: [heroImage],
    shortDescription: "Generously filled 95/5 feather-down insert with double-stitched ticking.",
    description: "A generously filled 95% feather, 5% down insert so your cover keeps its lofty shape.",
    variantGroups: [
      {
        id: "size",
        label: "Size",
        required: true,
        options: [
          { id: "18x18", label: '18" × 18"', priceDelta: 400 },
          { id: "20x20", label: '20" × 20"', priceDelta: 700 },
          { id: "24x24", label: '24" × 24"', priceDelta: 1100 }
        ],
      },
    ],
    careNotes: "Spot clean only. Air out in sun periodically to keep it lofted.",
    shippingNotes: "Ships within 3–5 business days — not made to order.",
    featured: true,
  },
  {
    id: "prod-accessory-monogram",
    slug: "monogram-add-on",
    name: "Custom Monogramming",
    category: "accessory",
    basePrice: 1399,
    images: [heroImage],
    shortDescription: "Hand-finished raised embroidery initials, up to three letters.",
    description: "Add up to three hand-embroidered initials in raised satin stitch to any pillow in your order.",
    variantGroups: [],
    careNotes: "Spot clean around embroidery; avoid direct ironing over stitching.",
    shippingNotes: "Adds no extra time — bundled with the item it's attached to.",
    featured: false,
  },
];

export async function fetchProducts(category?: ProductCategory): Promise<Product[]> {
  try {
    const qs = category ? `?category=${category}` : "";
    const res = await api.get<Product[]>(`/products${qs}`);
    if (res && Array.isArray(res) && res.length > 0) return res;
  } catch {
  }
  if (category) {
    return FALLBACK_PRODUCTS.filter((p) => p.category === category);
  }
  return FALLBACK_PRODUCTS;
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  try {
    const res = await api.get<Product>(`/products/${slug}`);
    if (res) return res;
  } catch {
  }
  const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (fallback) return fallback;
  throw new Error(`Product not found: ${slug}`);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await api.get<Product[]>("/products?featured=true");
    if (res && Array.isArray(res) && res.length > 0) return res;
  } catch {
  }
  return FALLBACK_PRODUCTS.filter((p) => p.featured);
}


