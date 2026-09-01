import type { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";
import { Reveal } from "../ui/Reveal";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p style={{ padding: "40px 0", textAlign: "center", opacity: 0.7 }}>Nothing here yet — check back soon.</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 32,
      }}
    >
      {products.map((product, i) => (
        <Reveal key={product.id} delayMs={(i % 4) * 60}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
