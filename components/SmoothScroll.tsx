"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({ duration: 1.2 });

    let frameId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    });

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.(
        'a[href^="/#"]'
      );
      const href = anchor?.getAttribute("href");
      if (!href) return;

      const [path, id] = href.split("#");
      if (!id || path !== window.location.pathname) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      const offset = -(
        parseFloat(getComputedStyle(target).scrollMarginTop) || 0
      );
      lenis.scrollTo(target, { offset });
    };

    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
