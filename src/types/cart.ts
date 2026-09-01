/**
 * A cart line can come from a normal product (variant IDs chosen from
 * fixed ProductVariantGroups) or from the Pillow/Case Designer (a full
 * custom config object). Either way, the server re-prices it from raw
 * IDs at checkout — the numbers here are only for display.
 */
export interface CartLineSelection {
  groupId: string;
  optionId: string;
  optionLabel: string;
}

export interface CartLine {
  lineId: string; // client-generated uuid, stable key for React + storage
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  quantity: number;
  /** cents, unit price including selected options, as last computed client-side */
  unitPrice: number;
  selections: CartLineSelection[];
  /** present when this line came from the Pillow/Case Designer */
  designerConfig?: Record<string, string>;
}

export interface CartState {
  lines: CartLine[];
}
