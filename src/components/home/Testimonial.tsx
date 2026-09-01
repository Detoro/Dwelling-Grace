import { useState } from "react";
import { COLORS, FONT_DISPLAY, FONT_MONO, RADIUS, SHADOW } from "../../theme";
import { Reveal } from "../ui/Reveal";

const REVIEWS = [
  {
    quote:
      "I sent them a swatch from my grandmother's vintage tablecloth and they matched the contrast piping to it exactly. It doesn't look like anything from a mass catalog — it feels like an heirloom.",
    author: "Marisol A.",
    location: "Austin, Texas",
    item: "Hearth Pillow in Wine Velvet with Gold Monogram",
  },
  {
    quote:
      "The real-time 3D designer made it so effortless to coordinate our living room trio before buying. When the package arrived wrapped in cotton, the raised embroidery took my breath away.",
    author: "Julian & Clara K.",
    location: "Brooklyn, New York",
    item: "Bespoke 3-Pillow Living Room Set in Oat Linen",
  },
];

export function Testimonial() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = REVIEWS[activeIdx];

  return (
    <section style={{ background: COLORS.creamDim, padding: "100px 24px", borderTop: `1px solid ${COLORS.line}` }}>
      <Reveal>
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            textAlign: "center",
            background: COLORS.white,
            borderRadius: RADIUS.lg,
            padding: "48px 36px",
            boxShadow: SHADOW.card,
            border: `1px solid ${COLORS.line}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 4, color: COLORS.gold, fontSize: 16, marginBottom: 20 }}>
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9733;</span>
          </div>

          <blockquote style={{ margin: 0 }}>
            <p
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(20px, 2.6vw, 26px)",
                lineHeight: 1.45,
                color: COLORS.ink,
                fontStyle: "italic",
                margin: "0 0 24px",
              }}
            >
              &ldquo;{current.quote}&rdquo;
            </p>
          </blockquote>

          <div>
            <p style={{ fontFamily: FONT_MONO, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: COLORS.ink, margin: 0, fontWeight: 600 }}>
              {current.author} &mdash; <span style={{ color: COLORS.inkSoft, fontWeight: 400 }}>{current.location}</span>
            </p>
            <p style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.goldMuted, marginTop: 6 }}>
              {current.item}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`View review ${i + 1}`}
                style={{
                  width: i === activeIdx ? 24 : 8,
                  height: 8,
                  borderRadius: 999,
                  background: i === activeIdx ? COLORS.wine : "rgba(26, 24, 21, 0.2)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );

}

