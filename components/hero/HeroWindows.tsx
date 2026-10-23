"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import Window from "@/components/hero/Window";
import EditorCard from "@/components/hero/EditorCard";

type HeroWindowsProps = {
  heroRef: RefObject<HTMLElement | null>;
};

const FLOAT_DURATIONS = [4.5, 5.5, 6.5];
const SWAY_DURATIONS = [7, 8, 9];

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

    let ctx: gsap.Context | undefined;
    let removeTilt: (() => void) | undefined;

    const teardown = () => {
      removeTilt?.();
      removeTilt = undefined;
      ctx?.revert();
      ctx = undefined;
    };

    const setup = () => {
      if (ctx) return;
      if (window.innerWidth < 1024) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      ctx = gsap.context(() => {
        gsap.set(movers, { opacity: 0, x: 80, rotation: -1.2 });

        const timeline = gsap.timeline();
        timeline.to(
          movers,
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.15,
          },
          2
        );

        const floatStart = timeline.duration();
        movers.forEach((mover, index) => {
          timeline.to(
            mover,
            {
              y: -16,
              duration: FLOAT_DURATIONS[index],
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            },
            floatStart
          );
          timeline.to(
            mover,
            {
              rotation: 1.2,
              duration: SWAY_DURATIONS[index],
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            },
            floatStart
          );
        });

        if (window.matchMedia("(hover: hover)").matches) {
          const rotateY = gsap.quickTo(scene, "rotationY", {
            duration: 0.5,
            ease: "power3.out",
          });
          const rotateX = gsap.quickTo(scene, "rotationX", {
            duration: 0.5,
            ease: "power3.out",
          });

          const onPointerMove = (event: PointerEvent) => {
            const rect = hero.getBoundingClientRect();
            const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
            rotateY(nx * 10);
            rotateX(-ny * 7);
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
    };

    const onResize = () => {
      if (window.innerWidth < 1024) {
        teardown();
      } else {
        setup();
      }
    };

    setup();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      teardown();
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
