import { COLORS } from "../../theme";

export function StitchDivider({ onDark = false }: { onDark?: boolean }) {
  const color = onDark ? COLORS.lineOnDark : COLORS.line;
  return (
    <div
      role="presentation"
      style={{
        height: 1,
        width: "100%",
        backgroundImage: `repeating-linear-gradient(to right, ${color} 0, ${color} 6px, transparent 6px, transparent 12px)`,
        margin: "0 auto",
      }}
    />
  );
}
