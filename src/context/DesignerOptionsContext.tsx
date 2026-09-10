import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react";
import type { DesignerOption, PillowDesignState } from "../types/designer";
import { fetchDesignerOptions, type DesignerOptionsResponse } from "../api/designer";

interface DesignerOptionsContextValue {
  options: DesignerOptionsResponse | null;
  fabrics: DesignerOption[];
  sizes: DesignerOption[];
  monogramTextures: { id: string; label: string; priceDelta: number }[];
  monogramFonts: { id: string; label: string; priceDelta: number }[];
  pillowBasePrice: number;
  loading: boolean;
  error: string | null;
  findOption: (list: DesignerOption[], id: string) => DesignerOption;
  findFabric: (id: string) => DesignerOption | undefined;
  computePillowPrice: (design: PillowDesignState) => number;
  refetch: () => Promise<void>;
}

const DesignerOptionsContext = createContext<DesignerOptionsContextValue | null>(null);

export function DesignerOptionsProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<DesignerOptionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDesignerOptions();
      setOptions(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load designer options from database";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const fabrics = useMemo(() => options?.fabrics ?? [], [options]);
  const sizes = useMemo(() => options?.sizes ?? [], [options]);
  const monogramTextures = useMemo(() => options?.monogramTextures ?? [], [options]);
  const monogramFonts = useMemo(() => options?.monogramFonts ?? [], [options]);
  const pillowBasePrice = options?.pillowBasePrice ?? 1899;

  function findOption(list: DesignerOption[], id: string): DesignerOption {
    const found = list.find((o) => o.id === id);
    if (found) return found;
    return list[0] ?? { id, label: id, priceDelta: 0 };
  }

  function findFabric(id: string): DesignerOption | undefined {
    return fabrics.find((f) => f.id === id);
  }

  function computePillowPrice(design: PillowDesignState): number {
    const fabric = findOption(fabrics, design.fabricId);
    const size = findOption(sizes, design.sizeId);

    let monogramPrice = 0;
    if (design.monogram?.trim()) {
      const tex = monogramTextures.find((t) => t.id === (design.monogramTexture ?? "linen"));
      monogramPrice = tex ? tex.priceDelta : 1400;
    }

    return (
      pillowBasePrice +
      (fabric?.priceDelta ?? 0) +
      (size?.priceDelta ?? 0) +
      monogramPrice
    );
  }

  const value: DesignerOptionsContextValue = {
    options,
    fabrics,
    sizes,
    monogramTextures,
    monogramFonts,
    pillowBasePrice,
    loading,
    error,
    findOption,
    findFabric,
    computePillowPrice,
    refetch: load,
  };

  return (
    <DesignerOptionsContext.Provider value={value}>
      {children}
    </DesignerOptionsContext.Provider>
  );
}

export function useDesignerOptions() {
  const ctx = useContext(DesignerOptionsContext);
  if (!ctx) {
    throw new Error("useDesignerOptions must be used within a DesignerOptionsProvider");
  }
  return ctx;
}
