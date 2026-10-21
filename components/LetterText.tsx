"use client";

import { Fragment, useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";

const RADIUS = 140;
const LIFT = 14;
const SKEW = 6;

type LetterTextProps = {
  text: string;
  heroRef: RefObject<HTMLElement | null>;
  gradient?: boolean;
};

export default function LetterText({
  text,
  heroRef,
  gradient = false,
}: LetterTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    if (!root || !hero) return;
    if (
      !window.matchMedia("(hover: hover)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const letters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-letter]")
    );
    const setters = letters.map((letter) => ({
      y: gsap.quickTo(letter, "y", { duration: 0.35, ease: "power3.out" }),
      skew: gsap.quickTo(letter, "skewX", {
        duration: 0.35,
        ease: "power3.out",
      }),
    }));

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      frame = 0;
      for (let i = 0; i < letters.length; i += 1) {
        const rect = letters[i].getBoundingClientRect();
        const dx = pointerX - (rect.left + rect.width / 2);
        const dy = pointerY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        const strength = Math.max(0, 1 - distance / RADIUS);
        setters[i].y(-LIFT * strength);
        setters[i].skew(-SKEW * strength);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onPointerLeave = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      for (const set of setters) {
        set.y(0);
        set.skew(0);
      }
    };

    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);

    return () => {
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
      gsap.killTweensOf(letters);
      gsap.set(letters, { clearProps: "transform" });
    };
  }, [heroRef]);

  const words = text.split(" ");

  return (
    <span ref={rootRef}>
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          {wordIndex > 0 ? " " : null}
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((letter, letterIndex) => (
              <span
                key={`${letter}-${letterIndex}`}
                data-letter
                className={
                  gradient ? "text-gradient inline-block" : "inline-block"
                }
              >
                {letter}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
