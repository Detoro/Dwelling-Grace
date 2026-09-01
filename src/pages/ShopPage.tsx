import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { COLORS, FONT_MONO } from "../theme";
import { SectionHead } from "../components/ui/SectionHead";
import { ProductGrid } from "../components/product/ProductGrid";
import { fetchProducts } from "../api/products";
import type { Product, ProductCategory } from "../types/product";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  pillow: "Pillows & Cushions",
  accessory: "Inserts & Add-Ons",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  all: "Every piece cut and finished to order from European linen bolts and Italian velvets.",
  pillow: "Square and lumbar cushion covers tailored to your desired size and trim.",
  accessory: "95/5 feather-down inserts, custom monogramming, and studio accessories.",
};

const CATEGORIES: ProductCategory[] = ["pillow", "accessory"];

export function ShopPage() {
  const { category } = useParams<{ category?: string }>();
  const activeCategory = category as ProductCategory | undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts(activeCategory)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 120px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft, marginBottom: 20 }}>
        <Link to="/" style={{ color: COLORS.inkSoft, textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <span style={{ color: COLORS.ink }}>Collection</span>
      </div>

      <SectionHead
        eyebrow="Curated Catalog"
        title={activeCategory ? CATEGORY_LABELS[activeCategory] : "The Atelier Collection"}
        description={activeCategory ? CATEGORY_DESCRIPTIONS[activeCategory] : CATEGORY_DESCRIPTIONS.all}
      />

      <div style={{ display: "flex", gap: 10, margin: "32px 0 44px", flexWrap: "wrap" }}>
        <FilterPill to="/shop" label="All Pieces" active={!activeCategory} count={5} />
        {CATEGORIES.map((c) => (
          <FilterPill key={c} to={`/shop/${c}`} label={CATEGORY_LABELS[c]} active={activeCategory === c} />
        ))}
      </div>


      {loading ? (
        <div style={{ padding: "80px 0", textAlign: "center", fontFamily: FONT_MONO, color: COLORS.inkSoft }}>
          Loading collection…
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

function FilterPill({ to, label, active }: { to: string; label: string; active: boolean; count?: number }) {
  return (
    <Link
      to={to}
      style={{
        fontFamily: FONT_MONO,
        fontSize: 12,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "9px 20px",
        borderRadius: 999,
        border: `1px solid ${active ? COLORS.wine : COLORS.line}`,
        background: active ? COLORS.wine : COLORS.white,
        color: active ? COLORS.cream : COLORS.ink,
        textDecoration: "none",
        fontWeight: active ? 600 : 400,
        boxShadow: active ? "0 4px 12px rgba(110, 42, 59, 0.2)" : "0 2px 6px rgba(0,0,0,0.03)",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </Link>
  );
}

