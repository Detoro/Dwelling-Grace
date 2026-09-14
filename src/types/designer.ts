export interface DesignerOption {
  id: string;
  label: string;
  priceDelta: number;
  swatchHex?: string;
  weave?: string;
}

export type MonogramFont = "serif" | "sans" | "futura" | "mono";
export type MonogramTexture = "damaske" | "silk" | "cotton" | "linen";
export type MonogramSpacing = "standard" | "wide";
export type MonogramSize = "sm" | "md" | "lg" | "xl";
export type MonogramPlacement = "front" | "back" | "both";
export type MonogramWrapMode = "single-line" | "multiline";

export interface PillowDesignState {
  id?: string;
  name?: string;
  fabricId: string;
  sizeId: string;
  monogram?: string;
  monogramBack?: string;
  monogramPlacement?: MonogramPlacement;
  monogramWrapMode?: MonogramWrapMode;
  monogramFont?: MonogramFont;
  monogramTexture?: MonogramTexture;
  monogramColor?: string;
  monogramSpacing?: MonogramSpacing;
  monogramSize?: MonogramSize;
  monogramScale?: number;
  quantity: number;
}


export const DEFAULT_PILLOW_DESIGN: PillowDesignState = {
  id: "pillow-1",
  name: "Pillow 1",
  fabricId: "linen-oat",
  sizeId: "18x18",
  monogram: "",
  monogramBack: "",
  monogramPlacement: "front",
  monogramWrapMode: "multiline",
  monogramFont: "serif",
  monogramTexture: "linen",
  monogramColor: "auto",
  monogramSpacing: "standard",
  monogramSize: "md",
  monogramScale: 2.35,
  quantity: 1,
};

export function createNewPillowDesign(index: number, fabricId: string = "linen-oat"): PillowDesignState {
  return {
    id: `pillow-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: `Pillow ${index}`,
    fabricId,
    sizeId: "18x18",
    monogram: "",
    monogramBack: "",
    monogramPlacement: "front",
    monogramWrapMode: "multiline",
    monogramFont: "serif",
    monogramTexture: "linen",
    monogramColor: "auto",
    monogramSpacing: "standard",
    monogramSize: "md",
    monogramScale: 2.35,
    quantity: 1,
  };
}