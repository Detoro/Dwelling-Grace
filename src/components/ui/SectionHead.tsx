import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../theme";

interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  onDark?: boolean;
}

export function SectionHead({ eyebrow, title, description, align = "left", onDark = false }: SectionHeadProps) {
  const ink = onDark ? COLORS.cream : COLORS.ink;
  const soft = onDark ? COLORS.lineOnDark : COLORS.inkSoft;
  return (
    <div style={{ textAlign: align, maxWidth: align === "center" ? 640 : undefined, margin: align === "center" ? "0 auto" : undefined }}>
      {eyebrow && (
        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: COLORS.gold,
            marginBottom: 10,
          }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 500,
          fontSize: "clamp(28px, 4vw, 42px)",
          color: ink,
          margin: 0,
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      {description && (
        <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.6, color: soft, maxWidth: 560, marginLeft: align === "center" ? "auto" : 0, marginRight: align === "center" ? "auto" : 0 }}>
          {description}
        </p>
      )}
    </div>
  );
}
