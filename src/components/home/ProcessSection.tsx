import { SectionHead } from "../ui/SectionHead";
import { Reveal } from "../ui/Reveal";
import { COLORS, FONT_MONO, FONT_DISPLAY, RADIUS, SHADOW } from "../../theme";

const STEPS = [
  {
    step: "01",
    title: "Select Natural Weave",
    body: "Belgian flax linen, plush Italian velvet, and lustrous silk crepe — pure natural fibers cut from bolts we store in our workroom.",
  },
  {
    step: "02",
    title: "Personalize Trims & Monogram",
    body: "Select contrast piping, horn buttons or hidden zip closures, and add your custom 1–3 letter monogram in raised embroidery.",
  },
  {
    step: "03",
    title: "Hand-Cut & Stitched",
    body: "Every piece is cut, aligned, and stitched to order by skilled artisans, ensuring pattern symmetry and reinforced seams.",
  },
  {
    step: "04",
    title: "Delivered in Cotton",
    body: "Wrapped in breathable unbleached cotton dustbags and shipped direct to your door with care instructions included.",
  },
];

export function ProcessSection() {
  return (
    <section style={{ padding: "90px 24px", maxWidth: 1240, margin: "0 auto" }}>
      <SectionHead
        eyebrow="Craftsmanship"
        title="From bolt to bedroom"
        description="We believe home furnishings should be built for longevity, tactile beauty, and personal distinction."
        align="center"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24,
          marginTop: 52,
        }}
      >
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delayMs={i * 70}>
            <div
              style={{
                background: COLORS.white,
                borderRadius: RADIUS.md,
                padding: "32px 26px",
                border: `1px solid ${COLORS.line}`,
                boxShadow: SHADOW.subtle,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "rgba(199, 162, 76, 0.12)",
                  color: COLORS.gold,
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 18,
                }}
              >
                {step.step}
              </div>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 20, margin: "0 0 10px", color: COLORS.ink, fontWeight: 500 }}>
                {step.title}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: COLORS.inkSoft, margin: 0 }}>
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

