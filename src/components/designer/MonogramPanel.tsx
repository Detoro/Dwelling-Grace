import { useState } from "react";
import {
  MONOGRAM_COLORS,
  MONOGRAM_FONTS as DEFAULT_FONTS,
  MONOGRAM_SIZES,
  MONOGRAM_SPACINGS,
  MONOGRAM_TEXTURES as DEFAULT_TEXTURES,
} from "../../data/designerOptions";
import type {
  MonogramFont,
  MonogramPlacement,
  MonogramSize,
  MonogramSpacing,
  MonogramTexture,
  MonogramWrapMode,
  PillowDesignState,
} from "../../types/designer";
import { useDesignerOptions } from "../../context/DesignerOptionsContext";
import { COLORS, FONT_MONO } from "../../theme";

interface MonogramPanelProps {
  design: PillowDesignState;
  onChange: (next: PillowDesignState) => void;
}

const SAMPLE_MONOGRAMS = ["DG", "CLAIRE", "HOME SWEET HOME", "EST. 2024"];

export function MonogramPanel({ design, onChange }: MonogramPanelProps) {
  const { monogramTextures: dbTextures, monogramFonts: dbFonts } = useDesignerOptions();

  const value = design.monogram ?? "";
  const backValue = design.monogramBack ?? "";
  const placement = design.monogramPlacement ?? "front";
  const wrapMode = design.monogramWrapMode ?? "multiline";
  const [separateBack, setSeparateBack] = useState(Boolean(design.monogramBack && design.monogramBack !== design.monogram));
  const selectedFont = design.monogramFont ?? "serif";
  const selectedTexture = design.monogramTexture ?? "linen";
  const selectedSpacing = design.monogramSpacing ?? "standard";
  const selectedSize = design.monogramSize ?? "md";
  const selectedScale = design.monogramScale ?? (
    selectedSize === "sm" ? 0.65 :
    selectedSize === "lg" ? 1.35 :
    selectedSize === "xl" ? 1.75 : 1.0
  );

  const textures = (dbTextures && dbTextures.length > 0)
    ? dbTextures.map((t) => {
        const fallback = DEFAULT_TEXTURES.find((df) => df.id === t.id);
        return {
          id: t.id as MonogramTexture,
          label: t.label,
          sub: fallback?.sub ?? "Raised 3D physical thread embroidery",
          priceDelta: t.priceDelta,
        };
      })
    : DEFAULT_TEXTURES;

  const fonts = (dbFonts && dbFonts.length > 0)
    ? dbFonts.map((f) => {
        const fallback = DEFAULT_FONTS.find((df) => df.id === f.id);
        return {
          id: f.id as MonogramFont,
          label: f.label,
          previewFont: fallback?.previewFont ?? "'Playfair Display', Georgia, serif",
        };
      })
    : DEFAULT_FONTS;

  function update<K extends keyof PillowDesignState>(key: K, val: PillowDesignState[K]) {
    onChange({ ...design, [key]: val });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: "100%", minWidth: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: "100%", minWidth: 0 }}>
        <textarea
          value={value}
          rows={wrapMode === "multiline" ? 2 : 1}
          placeholder="Enter custom inscription..."
          onChange={(e) => update("monogram", e.target.value.toUpperCase())}
          aria-label="Monogram or custom inscription"
          style={{
            width: "100%",
            minWidth: 0,
            maxWidth: "100%",
            boxSizing: "border-box",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            border: `1px solid ${value ? COLORS.wine : COLORS.line}`,
            borderRadius: 8,
            padding: "10px 14px",
            fontFamily: FONT_MONO,
            fontSize: 14,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: COLORS.ink,
            outline: "none",
            backgroundColor: "#FFFFFF",
            boxShadow: value ? "0 0 0 2px rgba(26, 54, 93, 0.12)" : "none",
            transition: "all 0.15s ease",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
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
                  padding: "3px 8px",
                  cursor: "pointer",
                }}
              >
                {sample}
              </button>
            ))}
          </div>

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange({
                  ...design,
                  monogram: "",
                  monogramBack: "",
                });
                setSeparateBack(false);
              }}
              title="Clear text"
              style={{
                background: "transparent",
                border: `1px solid ${COLORS.line}`,
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: COLORS.inkSoft,
                padding: "4px 12px",
                transition: "all 0.15s ease",
              }}
            >
              Clear &times;
            </button>
          )}
        </div>
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
              {fonts.map((font) => {
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
                      minWidth: 0,
                      overflow: "hidden",
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
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
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
              Monogram Material
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {textures.map((tex) => {
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {MONOGRAM_COLORS.map((c) => {
                const isSelected = (design.monogramColor ?? "auto") === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => update("monogramColor", c.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: `1px solid ${isSelected ? COLORS.wine : COLORS.line}`,
                      background: isSelected ? "rgba(26, 54, 93, 0.05)" : "transparent",
                      cursor: "pointer",
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: "1px solid rgba(0,0,0,0.15)",
                        background: c.isAuto ? "linear-gradient(135deg, #DFBA63 50%, #141E28 50%)" : c.hex,
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        color: isSelected ? COLORS.wine : COLORS.ink,
                        fontWeight: isSelected ? 600 : 400,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 0,
                      }}
                    >
                      {c.label}
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
              Placement on Pillow
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {[
                { id: "front", label: "Front" },
                { id: "back", label: "Back" },
                { id: "both", label: "Both Sides" }
              ].map((p) => {
                const isSelected = placement === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => update("monogramPlacement", p.id as MonogramPlacement)}
                    style={{
                      padding: "8px 4px",
                      borderRadius: 8,
                      border: `1px solid ${isSelected ? COLORS.wine : COLORS.line}`,
                      background: isSelected ? COLORS.wine : COLORS.white,
                      color: isSelected ? COLORS.cream : COLORS.ink,
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: isSelected ? 600 : 400,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                      minWidth: 0,
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {placement === "both" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 12px", background: "rgba(26, 54, 93, 0.03)", borderRadius: 8, border: `1px dashed ${COLORS.line}`, width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: FONT_MONO, fontSize: 11, color: COLORS.ink }}>
                <input
                  type="checkbox"
                  checked={separateBack}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSeparateBack(checked);
                    if (!checked) update("monogramBack", "");
                    else if (!backValue) update("monogramBack", value);
                  }}
                  style={{ accentColor: COLORS.wine }}
                />
                Different text on back side
              </label>
              {separateBack && (
                <textarea
                  value={backValue}
                  rows={2}
                  placeholder="Back side text (leave blank to mirror front)..."
                  onChange={(e) => update("monogramBack", e.target.value.toUpperCase())}
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    border: `1px solid ${COLORS.line}`,
                    borderRadius: 6,
                    padding: "8px 12px",
                    fontFamily: FONT_MONO,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: COLORS.ink,
                    outline: "none",
                    backgroundColor: "#FFFFFF",
                    resize: "vertical",
                  }}
                />
              )}
            </div>
          )}

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
              Text Layout
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { id: "multiline", label: "Wrap on New Line" },
                { id: "single-line", label: "Single Line (Auto-Fit)" },
              ].map((mode) => {
                const isSelected = wrapMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => update("monogramWrapMode", mode.id as MonogramWrapMode)}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: `1px solid ${isSelected ? COLORS.wine : COLORS.line}`,
                      background: isSelected ? COLORS.wine : COLORS.white,
                      color: isSelected ? COLORS.cream : COLORS.ink,
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: isSelected ? 600 : 400,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                      minWidth: 0,
                    }}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: COLORS.inkSoft,
                }}
              >
                Monogram Size
              </span>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  color: COLORS.wine,
                  fontWeight: 600,
                }}
              >
                {Math.round(selectedScale * 100)}% ({MONOGRAM_SIZES.find((s) => s.id === selectedSize)?.label ?? "Custom"})
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 12 }}>
              {MONOGRAM_SIZES.map((sz) => {
                const isSelected = selectedSize === sz.id;
                return (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...design,
                        monogramSize: sz.id,
                        monogramScale: sz.scale,
                      });
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 4px",
                      borderRadius: 8,
                      border: `1px solid ${isSelected ? COLORS.wine : COLORS.line}`,
                      background: isSelected ? COLORS.wine : COLORS.white,
                      color: isSelected ? COLORS.cream : COLORS.ink,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      minWidth: 0,
                    }}
                  >
                    <span style={{ fontFamily: FONT_MONO, fontSize: 11, fontWeight: 600 }}>
                      {sz.label}
                    </span>
                    <span style={{ fontSize: 9, opacity: isSelected ? 0.9 : 0.6, marginTop: 2 }}>
                      {sz.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft }}>50%</span>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.05"
                value={selectedScale}
                onChange={(e) => {
                  const newScale = parseFloat(e.target.value);
                  let closestSize: MonogramSize = "md";
                  if (newScale <= 0.8) closestSize = "sm";
                  else if (newScale <= 1.15) closestSize = "md";
                  else if (newScale <= 1.55) closestSize = "lg";
                  else closestSize = "xl";
                  onChange({
                    ...design,
                    monogramScale: newScale,
                    monogramSize: closestSize,
                  });
                }}
                style={{
                  flex: 1,
                  minWidth: 0,
                  accentColor: COLORS.wine,
                  cursor: "pointer",
                }}
              />
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft }}>180%</span>
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
              Letter Spacing
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {MONOGRAM_SPACINGS.map((sp) => {
                const isSelected = selectedSpacing === sp.id;
                return (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => update("monogramSpacing", sp.id as MonogramSpacing)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 6,
                      border: `1px solid ${isSelected ? COLORS.wine : COLORS.line}`,
                      background: isSelected ? COLORS.wine : COLORS.white,
                      color: isSelected ? COLORS.cream : COLORS.ink,
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: isSelected ? 600 : 400,
                      textAlign: "center",
                      minWidth: 0,
                    }}
                  >
                    {sp.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 12, lineHeight: 1.5, color: COLORS.inkSoft, margin: 0 }}>
          Personalize with letters in raised physical 3D embroidery with custom fonts, threads, and finishes.
        </p>
      )}
    </div>
  );
}