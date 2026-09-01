export interface CartLineSelection {
  groupId: string;
  optionId: string;
  optionLabel: string;
}

export interface CartLine {
  lineId: string;
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  selections: CartLineSelection[];
  designerConfig?: Record<string, string>;
}

export interface CartState {
  lines: CartLine[];
}

