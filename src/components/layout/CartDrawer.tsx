import { useState } from "react";
import { Link } from "react-router-dom";
import { COLORS, FONT_DISPLAY, FONT_MONO, SHADOW } from "../../theme";
import { useCart } from "../../context/CartContext";
import { QuantityStepper } from "../ui/QuantityStepper";
import { createCheckoutSession } from "../../api/checkout";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const FREE_SHIPPING_THRESHOLD_CENTS = 15000; // $150.00

export function CartDrawer() {
  const { lines, subtotal, isDrawerOpen, closeDrawer, setQuantity, removeLine } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isDrawerOpen) return null;

  const amountRemainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotal);
  const shippingProgressPct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD_CENTS) * 100));

  async function handleCheckout() {
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      const { checkoutUrl } = await createCheckoutSession(lines);
      window.location.href = checkoutUrl;
    } catch {
      setCheckoutError("Checkout couldn't connect. Please try again.");
      setIsCheckingOut(false);
    }
  }

  return (
    <>
      <div
        onClick={closeDrawer}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 29, 23, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 150,
          animation: "fadeIn 0.2s ease both",
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(460px, 100vw)",
          background: COLORS.cream,
          zIndex: 151,
          display: "flex",
          flexDirection: "column",
          boxShadow: SHADOW.raised,
          animation: "drawerSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: `1px solid ${COLORS.line}`,
            background: COLORS.white,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 21, margin: 0, fontWeight: 500 }}>Your Bag</h2>
            <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: COLORS.inkSoft }}>
              ({lines.reduce((sum, l) => sum + l.quantity, 0)} items)
            </span>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close bag"
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: COLORS.ink,
              padding: 4,
            }}
          >
            &#10005;
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ background: COLORS.creamDim, padding: "14px 24px", borderBottom: `1px solid ${COLORS.line}` }}>
          <p style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.04em", color: COLORS.ink, margin: "0 0 8px" }}>
            {amountRemainingForFreeShipping === 0 ? (
              <span style={{ color: COLORS.success, fontWeight: 600 }}>&#10003; You have unlocked Free US Shipping!</span>
            ) : (
              <span>Add <strong>{formatPrice(amountRemainingForFreeShipping)}</strong> more for Complimentary Shipping</span>
            )}
          </p>
          <div style={{ width: "100%", height: 5, background: "rgba(26, 24, 21, 0.1)", borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                width: `${shippingProgressPct}%`,
                height: "100%",
                background: amountRemainingForFreeShipping === 0 ? COLORS.success : COLORS.gold,
                borderRadius: 999,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Lines Scrollable Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {lines.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 16px" }}>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: COLORS.ink, margin: "0 0 8px" }}>
                Your bag is empty
              </p>
              <p style={{ color: COLORS.inkSoft, fontSize: 14, lineHeight: 1.6, maxWidth: 280, margin: "0 auto 28px" }}>
                Craft a custom pillow in our 3D Studio or browse the seasonal catalog.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link to="/designer" onClick={closeDrawer} className="btn-gold" style={{ width: "100%" }}>
                  Open 3D Design Studio
                </Link>
                <Link to="/shop" onClick={closeDrawer} className="btn-secondary" style={{ width: "100%" }}>
                  Explore Collection
                </Link>
              </div>
            </div>
          ) : (
            lines.map((line) => (
              <div
                key={line.lineId}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "18px 0",
                  borderBottom: `1px solid ${COLORS.line}`,
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 8,
                    overflow: "hidden",
                    background: COLORS.creamDim,
                    border: `1px solid ${COLORS.line}`,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={line.image}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <p style={{ fontFamily: FONT_DISPLAY, fontSize: 16, margin: 0, color: COLORS.ink, fontWeight: 500 }}>
                      {line.name}
                    </p>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: COLORS.wine, fontWeight: 600 }}>
                      {formatPrice(line.unitPrice * line.quantity)}
                    </span>
                  </div>

                  {line.selections.length > 0 && (
                    <p style={{ fontSize: 12, color: COLORS.inkSoft, margin: "6px 0" }}>
                      {line.selections.map((s) => s.optionLabel).join(" · ")}
                    </p>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    <QuantityStepper quantity={line.quantity} onChange={(q) => setQuantity(line.lineId, q)} />
                    <button
                      type="button"
                      onClick={() => removeLine(line.lineId)}
                      style={{
                        background: "none",
                        border: "none",
                        color: COLORS.wine,
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {lines.length > 0 && (
          <div style={{ padding: "20px 24px 28px", borderTop: `1px solid ${COLORS.line}`, background: COLORS.white }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_MONO, fontSize: 15, marginBottom: 8 }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600, color: COLORS.ink }}>{formatPrice(subtotal)}</span>
            </div>
            <p style={{ fontSize: 12, color: COLORS.inkSoft, marginBottom: 16 }}>
              Taxes and shipping calculated at Stripe checkout.
            </p>
            {checkoutError && (
              <p style={{ fontSize: 13, color: COLORS.error, marginBottom: 12 }}>{checkoutError}</p>
            )}
            <button
              type="button"
              disabled={lines.length === 0 || isCheckingOut}
              onClick={handleCheckout}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "15px 0",
                fontSize: 13,
                cursor: lines.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              {isCheckingOut ? "Connecting to Checkout…" : "Proceed to Checkout \u2192"}
            </button>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
                marginTop: 14,
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: COLORS.inkSoft,
              }}
            >
              <span>🔒 Encrypted 256-Bit SSL</span>
              <span>•</span>
              <span>Stripe Checkout</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

