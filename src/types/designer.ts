export interface DesignerOption {
  id: string;
  label: string;
  priceDelta: number; // cents
  swatchHex?: string;
  weave?: "linen" | "velvet" | "silk" | "floral";
}

export type MonogramFont = "serif" | "sans" | "script" | "mono";
export type MonogramTexture = "satin" | "silk" | "cotton" | "metallic";
export type MonogramSpacing = "tight" | "standard" | "wide";
export type MonogramSize = "sm" | "md" | "lg";

export interface PillowDesignState {
  id?: string;
  name?: string;
  fabricId: string;
  sizeId: string;
  pipingId: string;
  closureId: string;
  monogram?: string;
  monogramFont?: MonogramFont;
  monogramTexture?: MonogramTexture;
  monogramColor?: string; // hex or 'auto'
  monogramSpacing?: MonogramSpacing;
  monogramSize?: MonogramSize;
  quantity: number;
}

export const DEFAULT_PILLOW_DESIGN: PillowDesignState = {
  id: "pillow-1",
  name: "Pillow 1",
  fabricId: "linen-oat",
  sizeId: "18x18",
  pipingId: "piping-none",
  closureId: "closure-hidden-zip",
  monogram: "",
  monogramFont: "serif",
  monogramTexture: "satin",
  monogramColor: "auto",
  monogramSpacing: "standard",
  monogramSize: "md",
  quantity: 1,
};

export function createNewPillowDesign(index: number, fabricId: string = "linen-oat"): PillowDesignState {
  return {
    id: `pillow-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: `Pillow ${index}`,
    fabricId,
    sizeId: "18x18",
    pipingId: "piping-none",
    closureId: "closure-hidden-zip",
    monogram: "",
    monogramFont: "serif",
    monogramTexture: "satin",
    monogramColor: "auto",
    monogramSpacing: "standard",
    monogramSize: "md",
    quantity: 1,
  };
}

