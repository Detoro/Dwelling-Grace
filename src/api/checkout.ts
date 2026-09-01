import type { CartLine } from "../types/cart";
import { api } from "./client";

export interface CheckoutLinePayload {
  productId: string;
  quantity: number;
  selections: Record<string, string>;
  designerConfig?: Record<string, string>;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
}

function toPayload(lines: CartLine[]): CheckoutLinePayload[] {
  return lines.map((line) => ({
    productId: line.productId,
    quantity: line.quantity,
    selections: Object.fromEntries(line.selections.map((s) => [s.groupId, s.optionId])),
    designerConfig: line.designerConfig,
  }));
}

export async function createCheckoutSession(lines: CartLine[]): Promise<CheckoutSessionResponse> {
  return api.post<CheckoutSessionResponse>("/checkout/session", {
    lines: toPayload(lines),
  });
}

export interface OrderReceipt {
  orderId: string;
  email: string;
  total: number;
  lines: { name: string; quantity: number; unitPrice: number }[];
}

export async function fetchOrderBySessionId(sessionId: string): Promise<OrderReceipt> {
  return api.get<OrderReceipt>(`/checkout/session/${sessionId}`);
}

