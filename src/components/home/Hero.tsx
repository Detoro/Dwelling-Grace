import { Link } from "react-router-dom";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../theme";

export function Hero() {
  return (
    <section
      style={{
        background: `radial-gradient(circle at 50% 15%, #233E33 0%, ${COLORS.bgDeep} 65%, ${COLORS.bgDeep2} 100%)`,
        color: COLORS.cream,
        padding: "110px 24px 90px",
        position: "relative",
        overflow: "hidden",
        borderBottom: `1px solid ${COLORS.lineOnDark}`,
      }}
    >
      <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        {/* Atelier Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 999,
            background: "rgba(199, 162, 76, 0.12)",
            border: `1px solid rgba(199, 162, 76, 0.3)`,
            color: COLORS.goldLight,
            fontFamily: FONT_MONO,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.gold }} />
          Handcrafted Bespoke Atelier
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 400,
            fontSize: "clamp(38px, 5.8vw, 64px)",
            lineHeight: 1.08,
            margin: "0 auto",
            maxWidth: 780,
            letterSpacing: "-0.015em",
          }}
        >
          Pillows tailored to the exact fabric, trim, and monogram you desire.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: "rgba(247, 245, 238, 0.85)",
            marginTop: 24,
            maxWidth: 580,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Configure Belgian linens, plush velvets, contrast piping, and raised 3D thread embroidery in our real-time studio. Each piece is cut and stitched after you order.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
          <Link to="/designer" className="btn-gold" style={{ padding: "14px 30px", fontSize: 13 }}>
            Open 3D Design Studio &rarr;
          </Link>
          <Link
            to="/shop"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 13,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              background: "transparent",
              color: COLORS.cream,
              border: `1px solid ${COLORS.lineOnDark}`,
              padding: "14px 28px",
              borderRadius: 999,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Explore Catalog
          </Link>
        </div>

        {/* Highlights Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
            marginTop: 56,
            paddingTop: 32,
            borderTop: `1px solid ${COLORS.lineOnDark}`,
            flexWrap: "wrap",
            fontFamily: FONT_MONO,
            fontSize: 12,
            color: "rgba(247, 245, 238, 0.75)",
            letterSpacing: "0.03em",
          }}
        >
          <span>&bull; Real-time 3D Preview</span>
          <span>&bull; Raised Satin Embroidery</span>
          <span>&bull; Feather-Down Inserts</span>
          <span>&bull; Small Batch Hand-Stitching</span>
        </div>
      </div>
    </section>
  );
}

