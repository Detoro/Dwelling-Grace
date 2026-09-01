import { useEffect } from "react";
import { COLORS, FONT_BODY, SHADOW } from "../../theme";

interface ToastProps {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({ message, onDismiss, durationMs = 3200 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [onDismiss, durationMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: COLORS.ink,
        color: COLORS.cream,
        fontFamily: FONT_BODY,
        fontSize: 14,
        padding: "12px 22px",
        borderRadius: 999,
        boxShadow: SHADOW.raised,
        animation: "toast-in 0.25s ease both",
        zIndex: 200,
      }}
    >
      {message}
    </div>
  );
}
