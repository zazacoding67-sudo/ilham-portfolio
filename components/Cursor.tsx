"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";

const HOVER_SELECTOR = 'a, button, [data-cursor="hover"]';

const QUERY_COARSE = "(pointer: coarse)";
const QUERY_REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeToPointer(callback: () => void) {
  const coarse = window.matchMedia(QUERY_COARSE);
  const reduced = window.matchMedia(QUERY_REDUCED);
  coarse.addEventListener("change", callback);
  reduced.addEventListener("change", callback);
  return () => {
    coarse.removeEventListener("change", callback);
    reduced.removeEventListener("change", callback);
  };
}

function getCursorActive() {
  return (
    !window.matchMedia(QUERY_COARSE).matches &&
    !window.matchMedia(QUERY_REDUCED).matches
  );
}

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const active = useSyncExternalStore(
    subscribeToPointer,
    getCursorActive,
    () => false
  );

  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.style.cursor = "none";

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

    const onMove = (event: MouseEvent) => {
      gsap.set(dot, { x: event.clientX, y: event.clientY });
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onOver = (event: MouseEvent) => {
      const hovered = (
        event.target as HTMLElement | null
      )?.closest?.(HOVER_SELECTOR);
      gsap.to(ring, {
        scale: hovered ? 64 / 36 : 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      gsap.killTweensOf(ring);
      root.style.cursor = "";
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-accent"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-accent"
      />
    </>
  );
}
