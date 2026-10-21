"use client";

import { Fragment, useEffect, useRef, type RefObject } from "react";

const WASH_RADIUS = 150;
const FASTER = 0.35;
const SLOWER = 0.06;
const SCRAMBLE_CHARS = "#{}[]<>/\\|+=*%$@&0123456789";
const SCRAMBLE_DURATION = 320;
const SCRAMBLE_STEP = 45;
const SCRAMBLE_COOLDOWN = 700;

type RGB = [number, number, number];

type LetterRecord = {
  el: HTMLSpanElement;
  char: string;
  gradient: boolean;
  w: number;
  cx: number;
  cy: number;
  scrambling: boolean;
  cooldownUntil: number;
  interval: number;
};

function parseColor(value: string): RGB {
  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1];
    if (h.length === 3) {
      return [
        parseInt(h[0] + h[0], 16),
        parseInt(h[1] + h[1], 16),
        parseInt(h[2] + h[2], 16),
      ];
    }
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }
  const rgb = value.match(/rgba?\(([^)]+)\)/);
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).map(Number);
    if (parts.length >= 3) {
      return [parts[0], parts[1], parts[2]];
    }
  }
  return [232, 236, 245];
}

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
  const pointerRef = useRef({ x: 0, y: 0, inside: false });

  useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    if (!root || !hero) return;

    const records: LetterRecord[] = Array.from(
      root.querySelectorAll<HTMLSpanElement>("[data-letter]")
    ).map((el) => ({
      el,
      char: el.textContent ?? "",
      gradient: el.classList.contains("text-gradient"),
      w: 0,
      cx: 0,
      cy: 0,
      scrambling: false,
      cooldownUntil: 0,
      interval: 0,
    }));

    let disposed = false;
    let widthsSet = false;
    let resizeTimer = 0;
    let frameId = 0;
    let leaveTime = 0;
    let colors: { from: RGB; to: RGB; shadow: string } | null = null;

    const measureWidths = () => {
      if (widthsSet) {
        for (const record of records) {
          record.el.style.width = "";
        }
      }
      for (const record of records) {
        if (record.scrambling) {
          window.clearInterval(record.interval);
          record.interval = 0;
          record.scrambling = false;
          record.el.textContent = record.char;
        }
        record.el.style.width = `${record.el.offsetWidth}px`;
      }
      widthsSet = true;
    };

    const updateCentres = () => {
      for (const record of records) {
        const rect = record.el.getBoundingClientRect();
        record.cx = rect.left + rect.width / 2;
        record.cy = rect.top + rect.height / 2;
      }
    };

    const readColors = () => {
      const style = getComputedStyle(document.documentElement);
      const from = parseColor(style.getPropertyValue("--text"));
      const to = parseColor(style.getPropertyValue("--accent-2"));
      colors = {
        from,
        to,
        shadow: `rgba(${to[0]}, ${to[1]}, ${to[2]}, 0.5)`,
      };
    };

    const startScramble = (record: LetterRecord) => {
      const now = performance.now();
      record.scrambling = true;
      record.cooldownUntil = now + SCRAMBLE_COOLDOWN;
      const end = now + SCRAMBLE_DURATION;
      record.interval = window.setInterval(() => {
        if (performance.now() >= end) {
          window.clearInterval(record.interval);
          record.interval = 0;
          record.scrambling = false;
          record.el.textContent = record.char;
          return;
        }
        record.el.textContent =
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }, SCRAMBLE_STEP);
    };

    const frame = () => {
      frameId = 0;
      const pointer = pointerRef.current;
      const now = performance.now();
      const fading = !pointer.inside && now - leaveTime < 1500;
      let active = false;

      for (const record of records) {
        const dx = pointer.x - record.cx;
        const dy = pointer.y - record.cy;
        const distance = Math.hypot(dx, dy);
        const target =
          pointer.inside && distance < WASH_RADIUS
            ? 1 - distance / WASH_RADIUS
            : 0;

        record.w += (target - record.w) * (target > record.w ? FASTER : SLOWER);
        if (record.w < 0.001) record.w = 0;
        if (record.w > 0) active = true;

        if (!record.gradient && colors) {
          const { from, to, shadow } = colors;
          const mix = record.w;
          const r = Math.round(from[0] + (to[0] - from[0]) * mix);
          const g = Math.round(from[1] + (to[1] - from[1]) * mix);
          const b = Math.round(from[2] + (to[2] - from[2]) * mix);
          record.el.style.color = `rgb(${r}, ${g}, ${b})`;
          record.el.style.textShadow =
            mix > 0 ? `0 0 ${12 * mix}px ${shadow}` : "";
        }

        if (
          record.w > 0.35 &&
          !record.scrambling &&
          now >= record.cooldownUntil
        ) {
          startScramble(record);
        }
      }

      if (pointer.inside || fading || active) {
        frameId = requestAnimationFrame(frame);
      }
    };

    const ensureLoop = () => {
      if (!frameId) frameId = requestAnimationFrame(frame);
    };

    const onPointerEnter = (event: PointerEvent) => {
      readColors();
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      pointerRef.current.inside = true;
      updateCentres();
      ensureLoop();
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      if (!pointerRef.current.inside) {
        pointerRef.current.inside = true;
        readColors();
      }
      ensureLoop();
    };

    const onPointerLeave = () => {
      pointerRef.current.inside = false;
      leaveTime = performance.now();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measureWidths();
        updateCentres();
      }, 150);
    };

    const onScroll = () => {
      updateCentres();
    };

    measureWidths();
    updateCentres();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    void document.fonts.ready.then(() => {
      if (disposed) return;
      measureWidths();
      updateCentres();
    });

    const canTrack =
      window.matchMedia("(hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canTrack) {
      hero.addEventListener("pointerenter", onPointerEnter);
      hero.addEventListener("pointermove", onPointerMove);
      hero.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      disposed = true;
      hero.removeEventListener("pointerenter", onPointerEnter);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(resizeTimer);
      if (frameId) cancelAnimationFrame(frameId);
      for (const record of records) {
        if (record.interval) window.clearInterval(record.interval);
        record.el.textContent = record.char;
        record.el.style.width = "";
        record.el.style.color = "";
        record.el.style.textShadow = "";
      }
    };
  }, [heroRef]);

  const words = text.split(" ");

  return (
    <span ref={rootRef} aria-label={text}>
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          {wordIndex > 0 ? " " : null}
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((letter, letterIndex) => (
              <span
                key={`${letter}-${letterIndex}`}
                aria-hidden="true"
                data-letter
                className={
                  gradient
                    ? "text-gradient inline-block whitespace-pre text-center"
                    : "inline-block whitespace-pre text-center"
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
