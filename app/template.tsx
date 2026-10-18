"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";

const COLUMNS = 5;
const QUERY_REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(callback: () => void) {
  const query = window.matchMedia(QUERY_REDUCED);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReduced() {
  return window.matchMedia(QUERY_REDUCED).matches;
}

export default function Template({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    () => false
  );

  useEffect(() => {
    if (reduced) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const columns = overlay.querySelectorAll<HTMLElement>("[data-column]");
    const tween = gsap.fromTo(columns, { scaleY: 1 }, {
      scaleY: 0,
      duration: 0.7,
      ease: "power3.inOut",
      stagger: 0.08,
      transformOrigin: "top",
      onComplete: () => setDone(true),
    });

    return () => {
      tween.kill();
    };
  }, [reduced]);

  return (
    <>
      {!done && !reduced && (
        <div
          ref={overlayRef}
          className="pointer-events-none fixed inset-0 z-[9998] grid grid-cols-5"
        >
          {Array.from({ length: COLUMNS }).map((_, index) => (
            <div key={index} data-column className="h-full w-full bg-bg" />
          ))}
        </div>
      )}
      {children}
    </>
  );
}
