import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../theme";
import { fetchOrderBySessionId } from "../api/checkout";
import type { OrderReceipt } from "../api/checkout";
import { useCart } from "../context/CartContext";

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clear } = useCart();

  const [order, setOrder] = useState<OrderReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing order reference.");
      setLoading(false);
      return;
    }
    fetchOrderBySessionId(sessionId)
      .then((receipt) => {
        setOrder(receipt);
        clear();
      })
      .catch(() => setError("We couldn't load your order details, but your payment did go through."))
      .finally(() => setLoading(false));
    // clear() intentionally omitted from deps — it's stable per cart, and we
    // only want this to run once for this session id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 24px 120px", textAlign: "center" }}>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 34, color: COLORS.ink }}>Thank you</h1>

      {loading && <p style={{ opacity: 0.6, marginTop: 16 }}>Loading your receipt…</p>}

      {!loading && error && (
        <p style={{ color: COLORS.inkSoft, marginTop: 16 }}>{error}</p>
      )}

      {!loading && order && (
        <div style={{ marginTop: 32, textAlign: "left", background: COLORS.creamDim, borderRadius: 12, padding: 24 }}>
          <p style={{ fontFamily: FONT_MONO, fontSize: 12, color: COLORS.inkSoft, marginBottom: 4 }}>ORDER</p>
          <p style={{ fontFamily: FONT_MONO, fontSize: 14, marginBottom: 20 }}>{order.orderId}</p>

          {order.lines.map((line, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.line}`, fontSize: 14 }}>
              <span>
                {line.name} × {line.quantity}
              </span>
              <span>${((line.unitPrice * line.quantity) / 100).toFixed(2)}</span>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontFamily: FONT_MONO, fontSize: 15 }}>
            <span>Total</span>
            <span>${(order.total / 100).toFixed(2)}</span>
          </div>

          <p style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 20 }}>
            A confirmation has been sent to {order.email}.
          </p>
        </div>
      )}

      <Link to="/shop" style={{ display: "inline-block", marginTop: 32, fontFamily: FONT_MONO, fontSize: 13, color: COLORS.wine }}>
        Continue shopping
      </Link>
    </div>
  );
}
