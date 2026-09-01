import { useEffect, useRef, useState } from "react";
import type { CSSProperties, JSX, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function Reveal({ children, delayMs = 0, as = "div", className }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as as any;
  const style: CSSProperties = visible
    ? { animation: `reveal-up 0.7s ease both`, animationDelay: `${delayMs}ms` }
    : { opacity: 0 };

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
