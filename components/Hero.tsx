"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import LetterText from "@/components/LetterText";
import StatusBadge from "@/components/StatusBadge";

const MARQUEE_TEXT =
  "Next.js · React · TypeScript · Prisma · Supabase · Tailwind · GSAP · Flutter";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const glow = glowRef.current;
    if (!root || !glow) return;

    gsap.set(glow, { x: root.clientWidth - 600, y: 0 });

    if (
      !window.matchMedia("(hover: hover)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const xTo = gsap.quickTo(glow, "x", { duration: 1.2, ease: "power3.out" });
    const yTo = gsap.quickTo(glow, "y", { duration: 1.2, ease: "power3.out" });

    const onPointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      xTo(event.clientX - rect.left - 300);
      yTo(event.clientY - rect.top - 300);
    };

    root.addEventListener("pointermove", onPointerMove);

    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      gsap.killTweensOf(glow);
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const lines = root.querySelectorAll<HTMLElement>("[data-line] > span");
      const fades = root.querySelectorAll<HTMLElement>("[data-fade]");

      gsap.set(lines, { yPercent: 110 });
      gsap.set(fades, { y: 20, opacity: 0 });

      gsap.to(lines, {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        delay: 1.1,
        onComplete: () => {
          gsap.set(root.querySelectorAll("[data-line]"), {
            overflow: "visible",
          });
        },
      });

      gsap.to(fades, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        delay: 1.5,
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
    }, root);

    return () => ctx.revert();
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

      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--glow) 35%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-end gap-12 px-8 pb-[120px] pt-[160px] lg:grid-cols-[1.25fr_1fr]">
        <div>
          <div data-fade className="mb-5">
            <StatusBadge />
          </div>
          <p
            data-fade
            className="text-[13px] uppercase tracking-[0.12em] text-muted"
          >
            Full-stack Developer & Designer · Melaka, Malaysia
          </p>

          <h1 className="mt-6 font-sans font-semibold leading-[0.95] tracking-[-0.03em] text-[clamp(40px,5vw,84px)]">
            <span
              data-line
              className="block overflow-hidden pb-[0.12em] -mb-[0.12em] lg:whitespace-nowrap"
            >
              <span className="block">
                <LetterText text="From a message" heroRef={rootRef} />
              </span>
            </span>
            <span
              data-line
              className="block overflow-hidden pb-[0.12em] -mb-[0.12em] lg:whitespace-nowrap"
            >
              <span className="block">
                <LetterText text="to" heroRef={rootRef} />
                {" "}
                <span className="font-serif italic">
                  <LetterText
                    text="a live site."
                    gradient
                    heroRef={rootRef}
                  />
                </span>
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
              className="btn-gradient inline-flex items-center rounded-full px-7 py-3.5"
            >
              View projects
              <span className="btn-arrow" aria-hidden>
                <span>→</span>
              </span>
            </Link>
            <Link
              href="/#contact"
              data-cursor="hover"
              data-fade
              className="btn-outline inline-flex items-center rounded-full px-7 py-3.5"
            >
              Contact me
              <span className="btn-arrow" aria-hidden>
                <span>→</span>
              </span>
            </Link>
          </div>
        </div>

        <div
          id="hero-windows"
          className="relative hidden min-h-[560px] lg:block"
        ></div>
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
