import {
  MONOGRAM_COLORS,
  MONOGRAM_FONTS,
  MONOGRAM_SIZES,
  MONOGRAM_SPACINGS,
  MONOGRAM_TEXTURES,
} from "../../data/designerOptions";
import type {
  MonogramFont,
  MonogramSize,
  MonogramSpacing,
  MonogramTexture,
  PillowDesignState,
} from "../../types/designer";
import { COLORS, FONT_MONO } from "../../theme";

interface MonogramPanelProps {
  design: PillowDesignState;
  onChange: (next: PillowDesignState) => void;
}

const MAX_LENGTH = 3;
const SAMPLE_MONOGRAMS = ["DG", "CL", "AGY", "D"];

export function MonogramPanel({ design, onChange }: MonogramPanelProps) {
  const value = design.monogram ?? "";
  const selectedFont = design.monogramFont ?? "serif";
  const selectedTexture = design.monogramTexture ?? "satin";
  const selectedColor = design.monogramColor ?? "auto";
  const selectedSpacing = design.monogramSpacing ?? "standard";
  const selectedSize = design.monogramSize ?? "md";

  function update<K extends keyof PillowDesignState>(key: K, val: PillowDesignState[K]) {
    onChange({ ...design, [key]: val });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <input
          type="text"
          value={value}
          maxLength={MAX_LENGTH}
          placeholder="ABC"
          onChange={(e) => update("monogram", e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())}
          aria-label="Monogram initials, up to three letters"
          style={{
            width: 130,
            border: `1px solid ${value ? COLORS.wine : COLORS.line}`,
            borderRadius: 8,
            padding: "10px 14px",
            fontFamily: FONT_MONO,
            fontSize: 15,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: COLORS.ink,
            outline: "none",
            backgroundColor: "#FFFFFF",
            boxShadow: value ? "0 0 0 2px rgba(26, 54, 93, 0.12)" : "none",
            transition: "all 0.15s ease",
          }}
        />

        {value ? (
          <button
            type="button"
            onClick={() => update("monogram", "")}
            title="Clear monogram"
            style={{
              background: "transparent",
              border: `1px solid ${COLORS.line}`,
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: COLORS.inkSoft,
              padding: "6px 14px",
              transition: "all 0.15s ease",
            }}
          >
            Clear &times;
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft }}>Try:</span>
            {SAMPLE_MONOGRAMS.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => update("monogram", sample)}
                style={{
                  background: COLORS.white,
                  border: `1px solid ${COLORS.line}`,
                  borderRadius: 6,
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  color: COLORS.ink,
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                {sample}
              </button>
            ))}
          </div>
        )}
      </div>

      {value ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: "16px 18px",
            background: "#FFFFFF",
            borderRadius: 12,
            border: `1px solid ${COLORS.line}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: COLORS.inkSoft,
                display: "block",
                marginBottom: 8,
              }}
            >
              Typography &amp; Font
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {MONOGRAM_FONTS.map((font) => {
                const isSelected = selectedFont === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => update("monogramFont", font.id as MonogramFont)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${isSelected ? COLORS.wine : COLORS.line}`,
                      background: isSelected ? "rgba(26, 54, 93, 0.05)" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: font.previewFont,
                        fontSize: 18,
                        fontWeight: 600,
                        color: isSelected ? COLORS.wine : COLORS.ink,
                        lineHeight: 1.2,
                        marginBottom: 2,
                      }}
                    >
                      {value || "ABC"}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 10,
                        color: isSelected ? COLORS.wine : COLORS.inkSoft,
                      }}
                    >
                      {font.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: COLORS.inkSoft,
                display: "block",
                marginBottom: 8,
              }}
            >
              Thread Material &amp; Weave
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {MONOGRAM_TEXTURES.map((tex) => {
                const isSelected = selectedTexture === tex.id;
                return (
                  <button
                    key={tex.id}
                    type="button"
                    onClick={() => update("monogramTexture", tex.id as MonogramTexture)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${isSelected ? COLORS.wine : COLORS.line}`,
                      background: isSelected ? "rgba(26, 54, 93, 0.05)" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 12,
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected ? COLORS.wine : COLORS.ink,
                        }}
                      >
                        {tex.label}
                      </div>
                      <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 1 }}>
                        {tex.sub}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        color: isSelected ? COLORS.wine : COLORS.inkSoft,
                        fontWeight: 600,
                      }}
                    >
                      +${(tex.priceDelta / 100).toFixed(0)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: COLORS.inkSoft,
                display: "block",
                marginBottom: 8,
              }}
            >
              Thread Color
            </span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {MONOGRAM_COLORS.map((col) => {
                const isSelected = selectedColor === col.id;
                if (col.isAuto) {
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => update("monogramColor", "auto")}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        border: `1px solid ${isSelected ? COLORS.wine : COLORS.line}`,
                        background: isSelected ? COLORS.wine : COLORS.white,
                        color: isSelected ? COLORS.cream : COLORS.ink,
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        cursor: "pointer",
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      Auto Match
                    </button>
                  );
                }

                return (
                  <button
                    key={col.id}
                    type="button"
                    title={col.label}
                    onClick={() => update("monogramColor", col.id)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: col.hex,
                      border: `2px solid ${isSelected ? COLORS.wine : "rgba(0,0,0,0.15)"}`,
                      boxShadow: isSelected ? "0 0 0 2px rgba(26, 54, 93, 0.3)" : "none",
                      cursor: "pointer",
                      transition: "transform 0.15s ease",
                      transform: isSelected ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: COLORS.inkSoft,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Spacing
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                {MONOGRAM_SPACINGS.map((sp) => {
                  const isSelected = selectedSpacing === sp.id;
                  return (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => update("monogramSpacing", sp.id as MonogramSpacing)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: 6,
                        border: `1px solid ${isSelected ? COLORS.wine : COLORS.line}`,
                        background: isSelected ? COLORS.wine : COLORS.white,
                        color: isSelected ? COLORS.cream : COLORS.ink,
                        fontFamily: FONT_MONO,
                        fontSize: 10,
                        cursor: "pointer",
                        fontWeight: isSelected ? 600 : 400,
                        textAlign: "center",
                      }}
                    >
                      {sp.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: COLORS.inkSoft,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Scale Size
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                {MONOGRAM_SIZES.map((sz) => {
                  const isSelected = selectedSize === sz.id;
                  return (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => update("monogramSize", sz.id as MonogramSize)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: 6,
                        border: `1px solid ${isSelected ? COLORS.wine : COLORS.line}`,
                        background: isSelected ? COLORS.wine : COLORS.white,
                        color: isSelected ? COLORS.cream : COLORS.ink,
                        fontFamily: FONT_MONO,
                        fontSize: 10,
                        cursor: "pointer",
                        fontWeight: isSelected ? 600 : 400,
                        textAlign: "center",
                      }}
                    >
                      {sz.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 12, lineHeight: 1.5, color: COLORS.inkSoft, margin: 0 }}>
          Personalize with 1&ndash;3 letters in raised physical 3D embroidery with custom fonts, threads, and finishes.
        </p>
      )}
    </div>
  );
}



