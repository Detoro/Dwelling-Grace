import { Link } from "react-router-dom";
import { Newsletter } from "./Newsletter";
import { StitchDivider } from "../ui/StitchDivider";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../theme";

export function Footer() {
  return (
    <footer style={{ background: COLORS.bgDeep2, color: COLORS.cream, marginTop: 100, borderTop: `1px solid ${COLORS.lineOnDark}` }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 24px 36px" }}>
        <Newsletter />

        <div style={{ margin: "52px 0 40px" }}>
          <StitchDivider onDark />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: COLORS.gold,
                  color: COLORS.bgDeep,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_DISPLAY,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                D
              </span>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 20, margin: 0, fontWeight: 500 }}>
                Dwelling Grace
              </p>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(247, 245, 238, 0.7)", maxWidth: 300 }}>
              Made-to-order pillows, cushions, and bespoke monograms crafted from natural European linens and Italian velvets.
            </p>
          </div>

          <FooterColumn
            title="Studio & Shop"
            links={[
              { to: "/designer", label: "3D Design Studio" },
              { to: "/shop/pillow", label: "Pillow Catalog" },
              { to: "/shop/accessory", label: "Inserts & Accessories" },
            ]}
          />

          <FooterColumn
            title="Knowledge & Care"
            links={[
              { to: "/journal", label: "Fabric & Care Guide" },
              { to: "/journal", label: "Our Sourcing Story" },
              { to: "/journal", label: "Embroidered Monograms" },
            ]}
          />

          <div>
            <p style={{ fontFamily: FONT_MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.goldLight, marginBottom: 14 }}>
              The Atelier Standard
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(247, 245, 238, 0.7)" }}>
              Every pillow is hand-cut and finished individually in our dedicated workroom.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <span style={{ fontSize: 11, fontFamily: FONT_MONO, color: COLORS.goldMuted, background: "rgba(199,162,76,0.12)", padding: "4px 10px", borderRadius: 999 }}>
                100% Linen & Velvet
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            marginTop: 56,
            paddingTop: 24,
            borderTop: `1px solid ${COLORS.lineOnDark}`,
          }}
        >
          <p style={{ fontFamily: FONT_MONO, fontSize: 11, color: "rgba(247, 245, 238, 0.5)", margin: 0 }}>
            &copy; {new Date().getFullYear()} Dwelling Grace Furnishings. All rights reserved.
          </p>
          <p style={{ fontFamily: FONT_MONO, fontSize: 11, color: "rgba(247, 245, 238, 0.5)", margin: 0 }}>
            Hand-cut &bull; Hand-stitched &bull; Made to Order
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p style={{ fontFamily: FONT_MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.goldLight, marginBottom: 14 }}>
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              fontSize: 13,
              color: "rgba(247, 245, 238, 0.8)",
              textDecoration: "none",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

