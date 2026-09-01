import type { CartLine } from "../types/cart";
import { api } from "./client";

export interface CheckoutLinePayload {
  productId: string;
  quantity: number;
  /** raw option IDs only — the server looks up real prices, never trusts unitPrice */
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
  total: number; // cents
  lines: { name: string; quantity: number; unitPrice: number }[];
}

export async function fetchOrderBySessionId(sessionId: string): Promise<OrderReceipt> {
  return api.get<OrderReceipt>(`/checkout/session/${sessionId}`);
}
