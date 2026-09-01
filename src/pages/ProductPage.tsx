import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { COLORS, FONT_DISPLAY, FONT_MONO, RADIUS, SHADOW } from "../theme";
import { fetchProductBySlug } from "../api/products";
import type { Product } from "../types/product";
import { VariantPicker } from "../components/product/VariantPicker";
import { PriceSummary } from "../components/product/PriceSummary";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { Toast } from "../components/ui/Toast";
import { useCart } from "../context/CartContext";
import { StitchDivider } from "../components/ui/StitchDivider";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addLine } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<"care" | "shipping" | null>("care");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProductBySlug(slug).then((p) => {
      setProduct(p);
      const defaults: Record<string, string> = {};
      p.variantGroups.forEach((g) => {
        if (g.options[0]) defaults[g.id] = g.options[0].id;
      });
      setSelections(defaults);
      setActiveImage(0);
      setQuantity(1);
      setLoading(false);
    });
  }, [slug]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    let price = product.basePrice;
    product.variantGroups.forEach((g) => {
      const chosen = g.options.find((o) => o.id === selections[g.id]);
      if (chosen) price += chosen.priceDelta;
    });
    return price;
  }, [product, selections]);

  if (loading || !product) {
    return (
      <div style={{ padding: "100px 24px", textAlign: "center", fontFamily: FONT_MONO, color: COLORS.inkSoft }}>
        Loading piece…
      </div>
    );
  }

  function handleAddToBag() {
    if (!product) return;
    const lineSelections = product.variantGroups.map((g) => {
      const chosen = g.options.find((o) => o.id === selections[g.id])!;
      return { groupId: g.id, optionId: chosen.id, optionLabel: chosen.label };
    });
    addLine({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      image: product.images[0] ?? "/placeholder-pillow.svg",
      quantity,
      unitPrice,
      selections: lineSelections,
    });
    setToastMessage(`Added ${product.name} to your bag`);
  }

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 24px 120px" }}>
      {/* Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft, marginBottom: 28 }}>
        <Link to="/" style={{ color: COLORS.inkSoft, textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link to="/shop" style={{ color: COLORS.inkSoft, textDecoration: "none" }}>Collection</Link>
        <span>/</span>
        <span style={{ color: COLORS.ink }}>{product.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 60 }} className="product-detail-grid">
        {/* Gallery */}
        <div>
          <div
            style={{
              aspectRatio: "1 / 1",
              borderRadius: RADIUS.lg,
              overflow: "hidden",
              background: COLORS.creamDim,
              border: `1px solid ${COLORS.line}`,
              boxShadow: SHADOW.card,
            }}
          >
            <img
              src={product.images[activeImage] ?? "/placeholder-pillow.svg"}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          {product.images.length > 1 && (
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={activeImage === i}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: RADIUS.sm,
                    overflow: "hidden",
                    border: activeImage === i ? `2px solid ${COLORS.wine}` : `1px solid ${COLORS.line}`,
                    padding: 0,
                    cursor: "pointer",
                    background: COLORS.creamDim,
                  }}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          {/* 3D Studio Callout */}
          <div
            style={{
              marginTop: 24,
              background: COLORS.white,
              borderRadius: RADIUS.md,
              padding: "20px 22px",
              border: `1px solid ${COLORS.line}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 16, margin: "0 0 4px", color: COLORS.ink, fontWeight: 500 }}>
                Want to see this in real-time 3D?
              </p>
              <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0 }}>
                Customize embroidery, fabrics, and multiple pillow sets in our studio.
              </p>
            </div>
            <Link to="/designer" className="btn-gold" style={{ fontSize: 11, padding: "10px 18px", flexShrink: 0 }}>
              3D Studio &rarr;
            </Link>
          </div>
        </div>

        {/* Details Column */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(199, 162, 76, 0.12)", color: COLORS.gold, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            Made to Order
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, margin: 0, color: COLORS.ink, fontWeight: 500, letterSpacing: "-0.01em" }}>
            {product.name}
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: COLORS.inkSoft, marginTop: 14 }}>
            {product.shortDescription}
          </p>

          <div style={{ margin: "24px 0 28px", paddingBottom: 20, borderBottom: `1px solid ${COLORS.line}` }}>
            <PriceSummary unitPrice={unitPrice} quantity={quantity} />
          </div>

          {product.variantGroups.map((group) => (
            <VariantPicker
              key={group.id}
              group={group}
              selectedOptionId={selections[group.id]}
              onSelect={(optionId) => setSelections((s) => ({ ...s, [group.id]: optionId }))}
            />
          ))}

          {/* Action Row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
            <QuantityStepper quantity={quantity} onChange={setQuantity} />
            <button
              type="button"
              onClick={handleAddToBag}
              className="btn-primary add-to-bag-inline"
              style={{
                flex: 1,
                padding: "16px 0",
                fontSize: 13,
              }}
            >
              Add to bag &mdash; ${( (unitPrice * quantity) / 100).toFixed(2)}
            </button>
          </div>

          {/* Atelier Guarantees */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 24, padding: "16px", background: COLORS.white, borderRadius: RADIUS.md, border: `1px solid ${COLORS.line}`, fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft }}>
            <div>&bull; Hand-stitched in small batches</div>
            <div>&bull; Ships in 2–3 weeks</div>
            <div>&bull; 95/5 Feather-down compatible</div>
            <div>&bull; Free shipping over $150</div>
          </div>

          {/* Accordion Tabs */}
          <div style={{ marginTop: 36 }}>
            <StitchDivider />
            <Accordion title="Care & Maintenance" isOpen={openAccordion === "care"} onToggle={() => setOpenAccordion(openAccordion === "care" ? null : "care")}>
              {product.careNotes}
            </Accordion>
            <StitchDivider />
            <Accordion title="Shipping & Returns" isOpen={openAccordion === "shipping"} onToggle={() => setOpenAccordion(openAccordion === "shipping" ? null : "shipping")}>
              {product.shippingNotes}
            </Accordion>
            <StitchDivider />
          </div>
        </div>
      </div>

      {/* Sticky add-to-cart bar, mobile only */}
      <div className="sticky-add-bar">
        <div>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 15, margin: 0 }}>{product.name}</p>
          <p style={{ fontFamily: FONT_MONO, fontSize: 13, margin: 0, color: COLORS.wine, fontWeight: 600 }}>
            ${(unitPrice / 100).toFixed(2)}
          </p>
        </div>
        <button type="button" onClick={handleAddToBag} className="btn-primary" style={{ padding: "12px 22px" }}>
          Add to bag
        </button>
      </div>

      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}

      <style>{`
        .sticky-add-bar { display: none; }
        @media (max-width: 860px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .add-to-bag-inline { display: none; }
          .sticky-add-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: ${COLORS.cream};
            border-top: 1px solid ${COLORS.line};
            padding: 14px 20px;
            z-index: 90;
            box-shadow: ${SHADOW.raised};
          }
        }
      `}</style>
    </div>
  );
}

function Accordion({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          padding: "16px 0",
          cursor: "pointer",
          fontFamily: FONT_MONO,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: COLORS.ink,
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: 16, color: COLORS.inkSoft }}>{isOpen ? "\u2212" : "+"}</span>
      </button>
      {isOpen && <p style={{ fontSize: 14, lineHeight: 1.65, color: COLORS.inkSoft, paddingBottom: 16, margin: 0 }}>{children}</p>}
    </div>
  );
}

