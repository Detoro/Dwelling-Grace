import type { CSSProperties } from "react";
import { COLORS, FONT_MONO } from "../../theme";

interface QuantityStepperProps {
  quantity: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ quantity, onChange, min = 1, max = 20 }: QuantityStepperProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: `1px solid ${COLORS.line}`,
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        style={stepperButtonStyle}
      >
        −
      </button>
      <span
        style={{
          minWidth: 32,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 14,
          color: COLORS.ink,
        }}
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        style={stepperButtonStyle}
      >
        +
      </button>
    </div>
  );
}

const stepperButtonStyle: CSSProperties = {
  width: 32,
  height: 32,
  border: "none",
  background: "transparent",
  fontSize: 16,
  color: COLORS.ink,
  cursor: "pointer",
};
