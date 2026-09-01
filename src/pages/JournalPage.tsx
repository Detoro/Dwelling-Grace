import { COLORS, FONT_DISPLAY, FONT_MONO, RADIUS, SHADOW } from "../theme";
import { SectionHead } from "../components/ui/SectionHead";

const ARTICLES = [
  {
    tag: "Fabric Care",
    date: "August 2026",
    title: "How to Care for Natural Belgian Flax Linen",
    excerpt:
      "Flax linen grows softer and more pliable with age. Discover our workroom methods for spot cleaning, steaming, and preserving the natural slub texture of your covers.",
    readTime: "4 min read",
  },
  {
    tag: "Studio Sourcing",
    date: "July 2026",
    title: "Why We Source Small-Batch Italian Cotton Velvet",
    excerpt:
      "Unlike synthetic polyester velvets, dense-pile cotton velvet captures ambient room light with depth and tactile softness that synthetics can never replicate.",
    readTime: "6 min read",
  },
  {
    tag: "Styling Guide",
    date: "June 2026",
    title: "The Art of the 3-Pillow Sofa Arrangement",
    excerpt:
      "Balancing scale, texture contrast, and personalized monogram accents: how to compose a dynamic trio for your living room or reading nook.",
    readTime: "5 min read",
  },
];

export function JournalPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 120px" }}>
      <SectionHead
        eyebrow="Journal & Workroom Notes"
        title="Stories from the cutting table"
        description="Insights on European natural fibers, pillow styling, care guides, and behind-the-scenes techniques from our studio."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 32,
          marginTop: 56,
        }}
      >
        {ARTICLES.map((article) => (
          <article
            key={article.title}
            style={{
              background: COLORS.white,
              borderRadius: RADIUS.md,
              padding: "36px 30px",
              border: `1px solid ${COLORS.line}`,
              boxShadow: SHADOW.subtle,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            className="product-card"
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: COLORS.wine,
                    fontWeight: 600,
                  }}
                >
                  {article.tag}
                </span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft }}>
                  {article.date}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 22,
                  lineHeight: 1.25,
                  color: COLORS.ink,
                  margin: "0 0 14px",
                  fontWeight: 500,
                }}
              >
                {article.title}
              </h2>

              <p style={{ fontSize: 14, lineHeight: 1.65, color: COLORS.inkSoft, margin: 0 }}>
                {article.excerpt}
              </p>
            </div>

            <div style={{ marginTop: 28, paddingTop: 18, borderTop: `1px solid ${COLORS.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: COLORS.gold, fontWeight: 600 }}>
                Read Guide &rarr;
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft }}>
                {article.readTime}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

