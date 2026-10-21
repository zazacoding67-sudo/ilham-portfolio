"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

const MARQUEE_TEXT =
  "Next.js · React · TypeScript · Prisma · Supabase · Tailwind · GSAP · Flutter";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(root.querySelectorAll<HTMLElement>("[data-line] > span"), {
        yPercent: 100,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.3,
      });

      gsap.from(root.querySelectorAll("[data-fade]"), {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.8,
      });

      const track = root.querySelector("[data-marquee]");
      if (track) {
        gsap.to(track, {
          xPercent: -50,
          duration: 30,
          ease: "none",
          repeat: -1,
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-bg"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(45% 55% at 85% 15%, color-mix(in srgb, var(--glow) 35%, transparent) 0%, transparent 100%), radial-gradient(50% 60% at 15% 90%, color-mix(in srgb, var(--glow) 35%, transparent) 0%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-8 pb-[120px]">
        <p
          data-fade
          className="text-[13px] uppercase tracking-[0.12em] text-muted"
        >
          Full-stack Developer & Designer · Melaka, Malaysia
        </p>

        <h1 className="mt-6 font-sans font-semibold leading-[0.95] tracking-[-0.03em] text-[clamp(44px,8vw,128px)]">
          <span data-line className="block overflow-hidden">
            <span className="block">I build websites</span>
          </span>
          <span data-line className="block overflow-hidden">
            <span className="block">
              <span className="font-serif italic text-accent">
                real businesses
              </span>{" "}
              use.
            </span>
          </span>
        </h1>

        <p data-fade className="mt-8 max-w-[560px] text-[18px] text-muted">
          Computer Science student at UTeM (Database Management). I have built
          an online store, an event website and a recycling app for real
          clients and teams.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/#work"
            data-cursor="hover"
            data-fade
            className="btn-gradient rounded-full px-7 py-3.5"
          >
            View projects
          </Link>
          <Link
            href="/#contact"
            data-cursor="hover"
            data-fade
            className="rounded-full border border-border px-7 py-3.5 text-text"
          >
            Contact me
          </Link>
        </div>
      </div>

      <div className="relative z-10 overflow-hidden border-t border-border py-4">
        <div
          data-marquee
          className="flex w-max whitespace-nowrap will-change-transform"
        >
          {[0, 1].map((group) => (
            <span key={group} className="shrink-0 pr-10 text-sm uppercase text-muted">
              {`${MARQUEE_TEXT} · `}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
