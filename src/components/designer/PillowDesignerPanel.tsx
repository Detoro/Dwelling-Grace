import type { ReactNode } from "react";
import { SwatchButton } from "../ui/SwatchButton";
import { MonogramPanel } from "./MonogramPanel";
import type { PillowDesignState } from "../../types/designer";
import { CLOSURES, FABRICS, PIPING, SIZES } from "../../data/designerOptions";
import { COLORS, FONT_MONO } from "../../theme";

interface PillowDesignerPanelProps {
  design: PillowDesignState;
  onChange: (next: PillowDesignState) => void;
}

export function PillowDesignerPanel({ design, onChange }: PillowDesignerPanelProps) {
  function set<K extends keyof PillowDesignState>(key: K, value: PillowDesignState[K]) {
    onChange({ ...design, [key]: value });
  }

  return (
    <div>
      <OptionGroup label="1. Select Fabric" subtitle="Natural Belgian linen & Italian velvet">
        {FABRICS.map((f) => (
          <SwatchButton
            key={f.id}
            label={f.label}
            hex={f.swatchHex}
            priceDelta={f.priceDelta}
            selected={design.fabricId === f.id}
            onSelect={() => set("fabricId", f.id)}
          />
        ))}
      </OptionGroup>

      <OptionGroup label="2. Cushion Dimensions" subtitle="Standard tailored sizes">
        <PillGroup options={SIZES} selectedId={design.sizeId} onSelect={(id) => set("sizeId", id)} />
      </OptionGroup>

      <OptionGroup label="3. Edge Detailing" subtitle="Contrast piping or knife-edge">
        <PillGroup options={PIPING} selectedId={design.pipingId} onSelect={(id) => set("pipingId", id)} />
      </OptionGroup>

      <OptionGroup label="4. Closure Mechanism" subtitle="Hidden or horn button finish">
        <PillGroup options={CLOSURES} selectedId={design.closureId} onSelect={(id) => set("closureId", id)} />
      </OptionGroup>

      <OptionGroup label="5. Custom Monogram" subtitle="Embroidered initials & bespoke finish">
        <MonogramPanel design={design} onChange={onChange} />
      </OptionGroup>

    </div>
  );
}

function OptionGroup({ label, subtitle, children }: { label: string; subtitle?: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 26, paddingBottom: 18, borderBottom: `1px solid ${COLORS.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: COLORS.ink,
            fontWeight: 600,
            margin: 0,
          }}
        >
          {label}
        </p>
        {subtitle && (
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft }}>
            {subtitle}
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}

function PillGroup({
  options,
  selectedId,
  onSelect,
}: {
  options: { id: string; label: string; priceDelta: number }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {options.map((option) => {
        const selected = selectedId === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(option.id)}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 12,
              letterSpacing: "0.03em",
              padding: "8px 16px",
              borderRadius: 999,
              border: `1px solid ${selected ? COLORS.wine : COLORS.line}`,
              background: selected ? COLORS.wine : COLORS.white,
              color: selected ? COLORS.cream : COLORS.ink,
              fontWeight: selected ? 600 : 400,
              cursor: "pointer",
              boxShadow: selected ? "0 2px 8px rgba(110, 42, 59, 0.2)" : "0 1px 3px rgba(0,0,0,0.02)",
              transition: "all 0.15s ease",
            }}
          >
            {option.label}
            {option.priceDelta !== 0 && (
              <span style={{ opacity: selected ? 0.9 : 0.6, fontSize: 11, marginLeft: 4 }}>
                ({option.priceDelta > 0 ? "+" : "\u2212"}${Math.abs(option.priceDelta / 100).toFixed(0)})
              </span>
            )}
          </button>
        );
      })}
    </>
  );
}

