import { useState, type SubmitEvent } from "react";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../theme";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sent");
    setEmail("");
  }


  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
      <div>
        <p style={{ fontFamily: FONT_DISPLAY, fontSize: 26, margin: 0 }}>Stay in the loop</p>
        <p style={{ fontSize: 14, opacity: 0.75, marginTop: 8, maxWidth: 360 }}>
          New fabrics, restocks, and the occasional look inside the workroom.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <label htmlFor="newsletter-email" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{
            background: "transparent",
            border: `1px solid ${COLORS.lineOnDark}`,
            borderRadius: 999,
            padding: "10px 18px",
            color: COLORS.cream,
            fontSize: 14,
            minWidth: 220,
          }}
        />
        <button
          type="submit"
          style={{
            fontFamily: FONT_MONO,
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: COLORS.gold,
            color: COLORS.ink,
            border: "none",
            borderRadius: 999,
            padding: "10px 22px",
            cursor: "pointer",
          }}
        >
          {status === "sent" ? "Signed up" : "Sign up"}
        </button>
      </form>
    </div>
  );
}
