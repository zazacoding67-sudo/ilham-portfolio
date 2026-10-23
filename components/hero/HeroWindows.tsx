"use client";

import { useEffect, useRef, type RefObject } from "react";
import Window from "@/components/hero/Window";
import EditorCard from "@/components/hero/EditorCard";
import PerformanceCard from "@/components/hero/PerformanceCard";

type HeroWindowsProps = {
  heroRef: RefObject<HTMLElement | null>;
};

export default function HeroWindows({ heroRef }: HeroWindowsProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

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
      className="relative w-full overflow-visible"
      style={{
        perspective: "1200px",
        height: "min(560px, calc(100svh - 300px))",
        minHeight: "440px",
      }}
    >
      <div
        ref={sceneRef}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        <div
          className="absolute right-0 top-0 z-[2] w-[360px]"
          style={{ transform: "translateZ(80px)" }}
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
          className="absolute left-0 top-[44%] z-[3] w-[300px]"
          style={{ transform: "rotate(-3deg) translateZ(50px)" }}
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
          className="absolute bottom-0 right-6 z-[1] w-[380px]"
          style={{ transform: "rotate(2deg) translateZ(20px)" }}
        >
          <div className="hw-mover hw-mover-3">
            <div className="hw-float hw-float-3">
              <Window title="terminal">
                <p className="px-4 py-6 text-[13px] text-muted">coming next</p>
              </Window>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
