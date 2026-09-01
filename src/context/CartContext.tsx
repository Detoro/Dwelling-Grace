import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { ReactNode } from "react";
import type { CartLine, CartState } from "../types/cart";

const STORAGE_KEY = "dwelling-grace:cart";

type CartAction =
  | { type: "ADD_LINE"; line: CartLine }
  | { type: "REMOVE_LINE"; lineId: string }
  | { type: "SET_QUANTITY"; lineId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "REPLACE"; state: CartState };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_LINE": {
      const key = lineKey(action.line);
      const existing = state.lines.find((l) => lineKey(l) === key);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.lineId === existing.lineId ? { ...l, quantity: l.quantity + action.line.quantity } : l
          ),
        };
      }
      return { lines: [...state.lines, action.line] };
    }
    case "REMOVE_LINE":
      return { lines: state.lines.filter((l) => l.lineId !== action.lineId) };
    case "SET_QUANTITY":
      return {
        lines: state.lines
          .map((l) => (l.lineId === action.lineId ? { ...l, quantity: action.quantity } : l))
          .filter((l) => l.quantity > 0),
      };
    case "CLEAR":
      return { lines: [] };
    case "REPLACE":
      return action.state;
    default:
      return state;
  }
}

function lineKey(line: CartLine): string {
  const sel = [...line.selections]
    .sort((a, b) => a.groupId.localeCompare(b.groupId))
    .map((s) => `${s.groupId}:${s.optionId}`)
    .join("|");
  const config = line.designerConfig ? JSON.stringify(line.designerConfig) : "";
  return `${line.productId}::${sel}::${config}`;
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addLine: (line: Omit<CartLine, "lineId">) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "REPLACE", state: JSON.parse(raw) });
    } catch {
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
    }
  }, [state, hydrated]);


  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = state.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
    return {
      lines: state.lines,
      itemCount,
      subtotal,
      addLine: (line) => {
        dispatch({ type: "ADD_LINE", line: { ...line, lineId: crypto.randomUUID() } });
        setDrawerOpen(true);
      },
      removeLine: (lineId) => dispatch({ type: "REMOVE_LINE", lineId }),
      setQuantity: (lineId, quantity) => dispatch({ type: "SET_QUANTITY", lineId, quantity }),
      clear: () => dispatch({ type: "CLEAR" }),
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [state, isDrawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
