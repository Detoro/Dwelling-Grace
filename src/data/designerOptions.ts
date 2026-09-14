import type { DesignerOption, MonogramFont, MonogramTexture, MonogramSpacing, MonogramSize } from "../types/designer";

export const MONOGRAM_FONTS: { id: MonogramFont; label: string; previewFont: string }[] = [
  { id: "serif", label: "Classic Serif", previewFont: "'Playfair Display', Georgia, serif" },
  { id: "sans", label: "Modern Sans", previewFont: "'Plus Jakarta Sans', sans-serif" },
  { id: "mono", label: "Architectural Mono", previewFont: "'Space Mono', monospace" },
  { id: "futura", label: "Futura Bold", previewFont: "'Futura', 'Trebuchet MS', sans-serif" },
];

export const MONOGRAM_TEXTURES: { id: MonogramTexture; label: string; sub: string; priceDelta: number }[] = [
  { id: "silk", label: "Silk Floss", sub: "High-sheen micro-filaments with soft specular sheen", priceDelta: 1800 },
  { id: "cotton", label: "Matte Cotton", sub: "Textured natural organic cotton threads", priceDelta: 1400 },
  { id: "linen", label: "Linen Weave", sub: "Subtle woven texture with matte finish", priceDelta: 1600 },
  { id: "damaske", label: "Damask Weave", sub: "Intricate woven pattern with subtle sheen", priceDelta: 2000 },
];

export const MONOGRAM_COLORS: { id: string; label: string; hex?: string; isAuto?: boolean }[] = [
  { id: "auto", label: "Auto Contrast (Designer Pick)", isAuto: true },
  { id: "#E5C158", label: "Antique Gold", hex: "#E5C158" },
  { id: "#F0DFB0", label: "Champagne Cream", hex: "#F0DFB0" },
  { id: "#D0D5DD", label: "Silver Birch", hex: "#D0D5DD" },
];

export const MONOGRAM_SPACINGS: { id: MonogramSpacing; label: string; canvasSpacing: number }[] = [
  { id: "standard", label: "Standard", canvasSpacing: 8 },
  { id: "wide", label: "Wide", canvasSpacing: 24 },
];

export const MONOGRAM_SIZES: { id: MonogramSize; label: string; worldSize: number; scale: number; sub: string }[] = [
  { id: "sm", label: "Delicate", worldSize: 0.68, scale: 1.75, sub: "Small" },
  { id: "md", label: "Classic", worldSize: 0.90, scale: 2.35, sub: "Medium" },
  { id: "lg", label: "Statement", worldSize: 1.18, scale: 3.10, sub: "Large" },
  { id: "xl", label: "Grand", worldSize: 1.52, scale: 4.00, sub: "XL" },
];

export function findOption(list: DesignerOption[], id: string): DesignerOption {
  return list.find((o) => o.id === id) ?? list[0];
}