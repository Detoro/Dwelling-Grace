import type { DesignerOption, MonogramFont, MonogramTexture, MonogramSpacing, MonogramSize } from "../types/designer";

export const FABRICS: DesignerOption[] = [
  { id: "linen-oat", label: "Oat Linen", priceDelta: 0, swatchHex: "#D8CCB4", weave: "linen" },
  { id: "linen-clay", label: "Clay Linen", priceDelta: 0, swatchHex: "#B97D5D", weave: "linen" },
  { id: "velvet-navy", label: "Midnight Velvet", priceDelta: 2200, swatchHex: "#182B49", weave: "velvet" },
  { id: "velvet-wine", label: "Wine Velvet", priceDelta: 2200, swatchHex: "#5C1F2E", weave: "velvet" },
  { id: "velvet-moss", label: "Moss Velvet", priceDelta: 2200, swatchHex: "#3E4A34", weave: "velvet" },
  { id: "silk-gold", label: "Gold Silk", priceDelta: 4800, swatchHex: "#C7A24C", weave: "silk" },
  { id: "floral-jacquard", label: "Floral Jacquard", priceDelta: 4800, swatchHex: "#C7A24C", weave: "floral" },
];

export const SIZES: DesignerOption[] = [
  { id: "18x18", label: '18" × 18"', priceDelta: 0 },
  { id: "20x20", label: '20" × 20"', priceDelta: 600 },
  { id: "24x24", label: '24" × 24"', priceDelta: 1100 },
];

export const PIPING: DesignerOption[] = [
  { id: "piping-none", label: "No piping", priceDelta: 0 },
  { id: "piping-self", label: "Self-fabric piping", priceDelta: 900 },
  { id: "piping-contrast", label: "Contrast piping", priceDelta: 1400, swatchHex: "#C7A24C" },
];

export const CLOSURES: DesignerOption[] = [
  { id: "closure-hidden-zip", label: "Hidden zip", priceDelta: 0 },
  { id: "closure-button", label: "Horn buttons", priceDelta: 1100 },
  { id: "closure-envelope", label: "Envelope back", priceDelta: 0 },
];

export const MONOGRAM_FONTS: { id: MonogramFont; label: string; previewFont: string }[] = [
  { id: "serif", label: "Classic Serif", previewFont: "'Playfair Display', Georgia, serif" },
  { id: "script", label: "Artisanal Script", previewFont: "'Great Vibes', cursive" },
  { id: "sans", label: "Modern Sans", previewFont: "'Plus Jakarta Sans', sans-serif" },
  { id: "mono", label: "Architectural Mono", previewFont: "'Space Mono', monospace" },
];

export const MONOGRAM_TEXTURES: { id: MonogramTexture; label: string; sub: string; priceDelta: number }[] = [
  { id: "satin", label: "Satin Stitch", sub: "Lustrous raised angled filament ridges", priceDelta: 1400 },
  { id: "silk", label: "Silk Floss", sub: "High-sheen micro-filaments with soft specular sheen", priceDelta: 1800 },
  { id: "cotton", label: "Matte Cotton", sub: "Textured natural organic cotton threads", priceDelta: 1400 },
  { id: "metallic", label: "Metallic Gilt", sub: "Bullion gold metallic wire highlights", priceDelta: 2200 },
];

export const MONOGRAM_COLORS: { id: string; label: string; hex?: string; isAuto?: boolean }[] = [
  { id: "auto", label: "Auto Contrast (Designer Pick)", isAuto: true },
  { id: "#E5C158", label: "Antique Gold", hex: "#E5C158" },
  { id: "#F0DFB0", label: "Champagne Cream", hex: "#F0DFB0" },
  { id: "#FFFFFF", label: "Pure Ivory", hex: "#FFFFFF" },
  { id: "#0C1826", label: "Oxford Navy", hex: "#0C1826" },
  { id: "#6E2A3B", label: "Cordovan Wine", hex: "#6E2A3B" },
  { id: "#3E4A34", label: "Moss Green", hex: "#3E4A34" },
  { id: "#27221F", label: "Charcoal Espresso", hex: "#27221F" },
  { id: "#D0D5DD", label: "Silver Birch", hex: "#D0D5DD" },
];

export const MONOGRAM_SPACINGS: { id: MonogramSpacing; label: string; canvasSpacing: number }[] = [
  { id: "tight", label: "Tight", canvasSpacing: -6 },
  { id: "standard", label: "Standard", canvasSpacing: 8 },
  { id: "wide", label: "Wide", canvasSpacing: 24 },
];

export const MONOGRAM_SIZES: { id: MonogramSize; label: string; worldSize: number }[] = [
  { id: "sm", label: "Delicate", worldSize: 0.30 },
  { id: "md", label: "Classic", worldSize: 0.38 },
  { id: "lg", label: "Statement", worldSize: 0.48 },
];

export function findOption(list: DesignerOption[], id: string): DesignerOption {
  return list.find((o) => o.id === id) ?? list[0];
}

const PILLOW_BASE_PRICE = 1899; // cents

export function computePillowPrice(state: {
  fabricId: string;
  sizeId: string;
  pipingId: string;
  closureId: string;
  monogram?: string;
  monogramTexture?: MonogramTexture;
}): number {
  const fabric = findOption(FABRICS, state.fabricId);
  const size = findOption(SIZES, state.sizeId);
  const piping = findOption(PIPING, state.pipingId);
  const closure = findOption(CLOSURES, state.closureId);

  let monogramPrice = 0;
  if (state.monogram?.trim()) {
    const tex = MONOGRAM_TEXTURES.find((t) => t.id === (state.monogramTexture ?? "satin"));
    monogramPrice = tex ? tex.priceDelta : 1400;
  }

  return (
    PILLOW_BASE_PRICE +
    fabric.priceDelta +
    size.priceDelta +
    piping.priceDelta +
    closure.priceDelta +
    monogramPrice
  );
}

