import { COLORS, FONT_MONO } from "../../theme";

interface SwatchButtonProps {
  label: string;
  hex?: string;
  image?: string;
  selected: boolean;
  onSelect: () => void;
  priceDelta?: number;
}

function formatDelta(cents?: number): string {
  if (!cents) return "";
  const sign = cents > 0 ? "+" : "\u2212";
  return ` (${sign}$${Math.abs(cents / 100).toFixed(0)})`;
}

export function SwatchButton({ label, hex, image, selected, onSelect, priceDelta }: SwatchButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${label}${formatDelta(priceDelta)}`}
      title={`${label}${formatDelta(priceDelta)}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 4,
      }}
    >
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          display: "block",
          background: image ? `url(${image}) center/cover` : hex,
          border: selected ? `2px solid ${COLORS.wine}` : `1px solid ${COLORS.line}`,
          boxShadow: selected ? `0 0 0 3px ${COLORS.goldLight}` : "none",
          transition: "box-shadow 0.15s ease, border-color 0.15s ease",
        }}
      />
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 10,
          color: selected ? COLORS.ink : COLORS.inkSoft,
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: 64,
        }}
      >
        {label}
      </span>
    </button>
  );
}
