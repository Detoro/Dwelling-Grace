import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Hero } from "../components/home/Hero";
import { ProcessSection } from "../components/home/ProcessSection";
import { Testimonial } from "../components/home/Testimonial";
import { SectionHead } from "../components/ui/SectionHead";
import { ProductGrid } from "../components/product/ProductGrid";
import { fetchFeaturedProducts } from "../api/products";
import type { Product } from "../types/product";
import { COLORS, FONT_DISPLAY, FONT_MONO, RADIUS, SHADOW } from "../theme";

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchFeaturedProducts()
      .then((products) => {
        if (!cancelled) setFeatured(products);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Hero />

      <section style={{ padding: "90px 24px", maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <SectionHead
            eyebrow="Curated Essentials"
            title="Signature workroom favorites"
            description="Hand-stitched square pillows, reading lumbars, and double-ticked feather-down inserts."
          />
          <Link
            to="/shop"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.wine,
              textDecoration: "none",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              paddingBottom: 4,
            }}
          >
            View Full Catalog &rarr;
          </Link>
        </div>

        <div style={{ marginTop: 44 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", fontFamily: FONT_MONO, color: COLORS.inkSoft }}>
              Loading collection…
            </div>
          ) : (
            <ProductGrid products={featured} />
          )}
        </div>
      </section>

      <section style={{ background: COLORS.bgDeep, color: COLORS.cream, padding: "88px 24px", position: "relative", overflow: "hidden" }}>

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
          className="studio-spotlight-grid"
        >
          <div>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: COLORS.gold,
                display: "block",
                marginBottom: 12,
              }}
            >
              Interactive 3D Configurator
            </span>
            <h2
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(30px, 4vw, 44px)",
                lineHeight: 1.12,
                fontWeight: 500,
                margin: "0 0 18px",
              }}
            >
              Compose multi-pillow sets in real-time before you stitch.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(247, 245, 238, 0.8)", margin: "0 0 28px", maxWidth: 540 }}>
              Test Belgian linens side-by-side with Italian velvets. Add bespoke monograms with light-reactive satin thread sheen, preview the entire couch arrangement, and batch order with a single click.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link to="/designer" className="btn-gold" style={{ padding: "14px 30px" }}>
                Launch 3D Design Studio &rarr;
              </Link>
            </div>
          </div>

          <div
            style={{
              background: COLORS.bgDeep2,
              borderRadius: RADIUS.lg,
              padding: "36px 32px",
              border: `1px solid ${COLORS.lineOnDark}`,
              boxShadow: SHADOW.raised,
            }}
          >
            <p style={{ fontFamily: FONT_MONO, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: COLORS.goldLight, marginBottom: 16 }}>
              Atelier Features
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ color: COLORS.gold, fontWeight: 700 }}>&bull;</span>
                <div>
                  <strong style={{ fontFamily: FONT_DISPLAY, fontSize: 17, display: "block", color: COLORS.cream }}>Multi-Pillow Studio Layouts</strong>
                  <span style={{ fontSize: 13, color: "rgba(247, 245, 238, 0.7)" }}>Design multiple pillows concurrently and view them arranged in 3D couch perspective.</span>
                </div>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ color: COLORS.gold, fontWeight: 700 }}>&bull;</span>
                <div>
                  <strong style={{ fontFamily: FONT_DISPLAY, fontSize: 17, display: "block", color: COLORS.cream }}>Raised Thread Bump Shaders</strong>
                  <span style={{ fontSize: 13, color: "rgba(247, 245, 238, 0.7)" }}>Authentic micro-ridged satin stitching that glistens dynamically under studio lights.</span>
                </div>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ color: COLORS.gold, fontWeight: 700 }}>&bull;</span>
                <div>
                  <strong style={{ fontFamily: FONT_DISPLAY, fontSize: 17, display: "block", color: COLORS.cream }}>Instant Accurate Pricing</strong>
                  <span style={{ fontSize: 13, color: "rgba(247, 245, 238, 0.7)" }}>Live breakdown as you choose custom dimensions, contrast welt cord, and monograms.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <style>{`
          @media (max-width: 860px) {
            .studio-spotlight-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </section>

      <ProcessSection />
      <Testimonial />
    </>
  );
}

