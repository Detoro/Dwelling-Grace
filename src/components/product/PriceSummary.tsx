import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../theme";

export function PriceSummary({ unitPrice, quantity }: { unitPrice: number; quantity: number }) {
  const total = unitPrice * quantity;
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: COLORS.ink }}>
        ${(total / 100).toFixed(2)}
      </span>
      {quantity > 1 && (
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: COLORS.inkSoft }}>
          (${(unitPrice / 100).toFixed(2)} each)
        </span>
      )}
    </div>
  );
}
