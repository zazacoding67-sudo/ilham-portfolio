"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Window from "@/components/hero/Window";
import EditorCard from "@/components/hero/EditorCard";
import PerformanceCard from "@/components/hero/PerformanceCard";

type HeroWindowsProps = {
  heroRef: RefObject<HTMLElement | null>;
};

export default function HeroWindows({ heroRef }: HeroWindowsProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const wrapper = document.getElementById("hero-windows");
    if (!wrapper) return;

    let frame = 0;

    const compute = () => {
      frame = 0;
      if (window.innerWidth < 1024) return;
      const availW = wrapper.clientWidth;
      const availH = window.innerHeight - 200;
      const next = Math.max(
        0.72,
        Math.min(1, availW / 600, availH / 600)
      );
      setScale(next);
      if (process.env.NODE_ENV !== "production") {
        console.log("[hero windows] scale", next);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(wrapper);
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const scene = sceneRef.current;
    if (!hero) {
      console.warn("[hero windows] hero ref missing");
      return;
    }
    if (!scene) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[hero windows] tilt active");
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const render = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      scene.style.transform = `rotateX(${currentX.toFixed(
        2
      )}deg) rotateY(${currentY.toFixed(2)}deg)`;

      if (
        Math.abs(targetX - currentX) > 0.01 ||
        Math.abs(targetY - currentY) > 0.01
      ) {
        frame = requestAnimationFrame(render);
      }
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      targetY = nx * 10;
      targetX = -ny * 7;
      start();
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);

    return () => {
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
      scene.style.transform = "";
    };
  }, [heroRef]);

  return (
    <div
      className="relative ml-auto"
      style={{
        width: `${600 * scale}px`,
        height: `${600 * scale}px`,
      }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: "600px",
          height: "600px",
          perspective: "1200px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <div
          ref={sceneRef}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          <div
            className="absolute right-0 top-0 z-[2] w-[340px]"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="hw-mover hw-mover-1">
              <div className="hw-float hw-float-1">
                <Window title="theme.css">
                  <EditorCard />
                </Window>
              </div>
            </div>
          </div>

          <div
            className="absolute left-0 top-[190px] z-[3] w-[250px]"
            style={{ transform: "rotate(-3deg) translateZ(20px)" }}
          >
            <div className="hw-mover hw-mover-2">
              <div className="hw-float hw-float-2">
                <Window title="performance">
                  <PerformanceCard />
                </Window>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-0 right-0 z-[1] w-[330px]"
            style={{ transform: "rotate(2deg) translateZ(0px)" }}
          >
            <div className="hw-mover hw-mover-3">
              <div className="hw-float hw-float-3">
                <Window title="terminal">
                  <p className="h-[190px] px-4 py-6 text-[13px] text-muted">
                    coming next
                  </p>
                </Window>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
