import { Link } from "react-router-dom";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../theme";

export function CheckoutCancelPage() {
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "100px 24px 140px", textAlign: "center" }}>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 30, color: COLORS.ink }}>Checkout canceled</h1>
      <p style={{ color: COLORS.inkSoft, marginTop: 14, lineHeight: 1.6 }}>
        Nothing was charged. Your bag is still saved if you'd like to pick up where you left off.
      </p>
      <Link
        to="/shop"
        style={{
          display: "inline-block",
          marginTop: 28,
          fontFamily: FONT_MONO,
          fontSize: 13,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          background: COLORS.wine,
          color: COLORS.cream,
          padding: "12px 24px",
          borderRadius: 999,
          textDecoration: "none",
        }}
      >
        Back to shop
      </Link>
    </div>
  );
}
