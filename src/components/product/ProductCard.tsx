import { Link } from "react-router-dom";
import { COLORS, FONT_DISPLAY, FONT_MONO, RADIUS, SHADOW } from "../../theme";
import type { Product } from "../../types/product";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export function ProductCard({ product }: { product: Product }) {
  const isPillow = product.category === "pillow";

  return (
    <Link
      to={`/products/${product.slug}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <div
        className="product-card"
        style={{
          background: COLORS.white,
          borderRadius: RADIUS.md,
          overflow: "hidden",
          boxShadow: SHADOW.card,
          border: `1px solid ${COLORS.line}`,
          position: "relative",
        }}
      >
        {/* Category / Badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2,
            background: "rgba(247, 245, 238, 0.9)",
            backdropFilter: "blur(6px)",
            padding: "4px 10px",
            borderRadius: 999,
            border: `1px solid ${COLORS.line}`,
            fontFamily: FONT_MONO,
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: COLORS.ink,
          }}
        >
          {isPillow ? "Made to Order" : "In Stock"}
        </div>

        {/* Product Image */}
        <div
          style={{
            aspectRatio: "1 / 1",
            background: COLORS.creamDim,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                // If image 404s, replace with styled SVG placeholder
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 24,
                color: COLORS.inkSoft,
                opacity: 0.5,
              }}
            >
              Dwelling Grace
            </div>
          )}
        </div>

        {/* Content Footer */}
        <div style={{ padding: "16px 18px 18px", borderTop: `1px solid ${COLORS.line}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <p
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 17,
                margin: 0,
                color: COLORS.ink,
                fontWeight: 500,
              }}
            >
              {product.name}
            </p>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 13,
                color: COLORS.wine,
                fontWeight: 600,
              }}
            >
              {formatPrice(product.basePrice)}
            </span>
          </div>

          <p
            style={{
              fontSize: 13,
              color: COLORS.inkSoft,
              marginTop: 4,
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.shortDescription}
          </p>
        </div>
      </div>
    </Link>
  );
}

