"use client";

import { useEffect, useRef, type ReactNode } from "react";

let revealObserver: IntersectionObserver | null = null;

function getRevealObserver() {
  if (revealObserver || typeof window === "undefined") {
    return revealObserver;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  return revealObserver;
}

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = getRevealObserver();
    if (!io) return;
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <div ref={ref} className={["reveal", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
