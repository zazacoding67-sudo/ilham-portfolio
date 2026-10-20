"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { setLenis, getLenis } from "@/lib/lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({ duration: 1.2 });
    setLenis(lenis);

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
      lenis.scrollTo(target);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.clientX >= document.documentElement.clientWidth) {
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      }
    };

    let scrollTimer: number | undefined;
    const onScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        if (
          lenis.isScrolling !== "smooth" &&
          Math.abs(window.scrollY - lenis.animatedScroll) > 2
        ) {
          lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        }
      }, 150);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollTimer);
      cancelAnimationFrame(frameId);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    const lenis = getLenis();
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true, force: true });
    lenis.resize();
  }, [pathname]);

  return <>{children}</>;
}
