import type { DesignerOption } from "../types/designer";
import { api } from "./client";

export interface DesignerOptionsResponse {
  fabrics: DesignerOption[];
  sizes: DesignerOption[];
  monogramTextures: { id: string; label: string; priceDelta: number }[];
  monogramFonts: { id: string; label: string; priceDelta: number }[];
  caseSizes: DesignerOption[];
  pillowBasePrice: number;
  caseBasePrice: number;
}

export async function fetchDesignerOptions(): Promise<DesignerOptionsResponse> {
  return await api.get<DesignerOptionsResponse>("/products/designer-options");
}