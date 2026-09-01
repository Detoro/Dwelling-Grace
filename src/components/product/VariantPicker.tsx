import { COLORS, FONT_MONO } from "../../theme";
import type { ProductVariantGroup } from "../../types/product";
import { SwatchButton } from "../ui/SwatchButton";

interface VariantPickerProps {
  group: ProductVariantGroup;
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
}

export function VariantPicker({ group, selectedOptionId, onSelect }: VariantPickerProps) {
  const isSwatchGroup = group.options.some((o) => o.swatchHex || o.swatchImage);

  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontFamily: FONT_MONO, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: COLORS.inkSoft, marginBottom: 12 }}>
        {group.label}
        {!group.required && " (optional)"}
      </p>

      {isSwatchGroup ? (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {group.options.map((option) => (
            <SwatchButton
              key={option.id}
              label={option.label}
              hex={option.swatchHex}
              image={option.swatchImage}
              priceDelta={option.priceDelta}
              selected={selectedOptionId === option.id}
              onSelect={() => onSelect(option.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {group.options.map((option) => {
            const selected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(option.id)}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  padding: "9px 16px",
                  borderRadius: 999,
                  border: `1px solid ${selected ? COLORS.wine : COLORS.line}`,
                  background: selected ? COLORS.wine : "transparent",
                  color: selected ? COLORS.cream : COLORS.ink,
                  cursor: "pointer",
                }}
              >
                {option.label}
                {option.priceDelta !== 0 && (
                  <span style={{ opacity: 0.7 }}>
                    {" "}
                    ({option.priceDelta > 0 ? "+" : "\u2212"}${Math.abs(option.priceDelta / 100).toFixed(0)})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
