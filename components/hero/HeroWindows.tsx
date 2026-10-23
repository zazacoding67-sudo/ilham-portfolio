"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import Window from "@/components/hero/Window";
import EditorCard from "@/components/hero/EditorCard";

type HeroWindowsProps = {
  heroRef: RefObject<HTMLElement | null>;
};

const FLOAT_DURATIONS = [5, 6, 7];

export default function HeroWindows({ heroRef }: HeroWindowsProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const moverRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const scene = sceneRef.current;
    if (!hero || !scene) return;

    const movers = moverRefs.current.filter(
      (mover): mover is HTMLDivElement => mover !== null
    );
    if (movers.length !== 3) return;

    if (
      window.innerWidth < 1024 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const hoverable = window.matchMedia("(hover: hover)").matches;
    let removeTilt: (() => void) | undefined;

    const ctx = gsap.context(() => {
      gsap.set(movers, { opacity: 0, x: 80 });

      gsap.to(movers, {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
        delay: 2,
        onComplete: () => {
          movers.forEach((mover, index) => {
            gsap.to(mover, {
              y: -8,
              duration: FLOAT_DURATIONS[index],
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: index * 0.5,
            });
          });
        },
      });

      if (hoverable) {
        const rotateY = gsap.quickTo(scene, "rotationY", {
          duration: 0.6,
          ease: "power3.out",
        });
        const rotateX = gsap.quickTo(scene, "rotationX", {
          duration: 0.6,
          ease: "power3.out",
        });

        const onPointerMove = (event: PointerEvent) => {
          const rect = hero.getBoundingClientRect();
          const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
          rotateY(nx * 6);
          rotateX(-ny * 5);
        };

        const onPointerLeave = () => {
          rotateY(0);
          rotateX(0);
        };

        hero.addEventListener("pointermove", onPointerMove);
        hero.addEventListener("pointerleave", onPointerLeave);

        removeTilt = () => {
          hero.removeEventListener("pointermove", onPointerMove);
          hero.removeEventListener("pointerleave", onPointerLeave);
        };
      }
    }, scene);

    return () => {
      removeTilt?.();
      ctx.revert();
    };
  }, [heroRef]);

  return (
    <div
      className="relative h-[560px] w-full"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={sceneRef}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute right-0 top-0 w-[360px]"
          style={{ transform: "translateZ(80px)" }}
        >
          <div
            ref={(element) => {
              moverRefs.current[0] = element;
            }}
          >
            <Window title="theme.css">
              <EditorCard />
            </Window>
          </div>
        </div>

        <div
          className="absolute left-0 top-[190px] w-[320px]"
          style={{ transform: "rotate(-3deg) translateZ(50px)" }}
        >
          <div
            ref={(element) => {
              moverRefs.current[1] = element;
            }}
          >
            <Window title="performance">
              <p className="px-4 py-6 text-[13px] text-muted">coming next</p>
            </Window>
          </div>
        </div>

        <div
          className="absolute bottom-0 right-6 w-[380px]"
          style={{ transform: "rotate(2deg) translateZ(20px)" }}
        >
          <div
            ref={(element) => {
              moverRefs.current[2] = element;
            }}
          >
            <Window title="terminal">
              <p className="px-4 py-6 text-[13px] text-muted">coming next</p>
            </Window>
          </div>
        </div>
      </div>
    </div>
  );
}
