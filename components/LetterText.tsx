"use client";

import { Fragment, useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";

const RADIUS = 140;
const LIFT = 14;
const SKEW = 6;

type LetterTextProps = {
  text: string;
  heroRef: RefObject<HTMLElement | null>;
};

export default function LetterText({ text, heroRef }: LetterTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    if (!root || !hero) return;
    if (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const letters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-letter]")
    );
    const setters = letters.map((letter) => ({
      letter,
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
      for (const { letter, y, skew } of setters) {
        const rect = letter.getBoundingClientRect();
        const dx = pointerX - (rect.left + rect.width / 2);
        const dy = pointerY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance < RADIUS) {
          const strength = 1 - distance / RADIUS;
          y(-LIFT * strength);
          skew((dx / RADIUS) * SKEW * strength);
        } else {
          y(0);
          skew(0);
        }
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
      for (const { y, skew } of setters) {
        y(0);
        skew(0);
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
                className="inline-block"
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
