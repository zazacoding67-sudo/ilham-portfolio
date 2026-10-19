"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "gsap";
import { projects, type Project } from "@/data/projects";

export default function WorkList() {
  const previewRef = useRef<HTMLDivElement>(null);
  const quickX = useRef<((value: number) => void) | null>(null);
  const quickY = useRef<((value: number) => void) | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    gsap.set(preview, { xPercent: -50, yPercent: -50 });
    quickX.current = gsap.quickTo(preview, "x", {
      duration: 0.4,
      ease: "power3",
    });
    quickY.current = gsap.quickTo(preview, "y", {
      duration: 0.4,
      ease: "power3",
    });

    return () => {
      quickX.current = null;
      quickY.current = null;
    };
  }, []);

  const previewSrc = hovered?.images[0] ?? null;

  const handleEnter = (project: Project, event: MouseEvent<HTMLAnchorElement>) => {
    setHovered(project);
    if (!project.images[0] || !previewRef.current) return;
    gsap.set(previewRef.current, { x: event.clientX, y: event.clientY });
  };

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    quickX.current?.(event.clientX);
    quickY.current?.(event.clientY);
  };

  const handleLeave = () => setHovered(null);

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-8 pb-6">
        <div className="flex items-baseline justify-between text-[13px] uppercase tracking-[0.12em] text-muted">
          <span>Selected work</span>
          <span>({String(projects.length).padStart(2, "0")})</span>
        </div>
      </div>

      <div>
        {projects.map((project, index) => {
          const isLast = index === projects.length - 1;

          return (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              data-cursor="hover"
              onMouseEnter={(event) => handleEnter(project, event)}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              className={`group mx-auto block max-w-[1400px] px-8 py-10 transition-colors duration-300 [@media(hover:hover)]:hover:bg-surface ${
                isLast ? "border-y border-border" : "border-t border-border"
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <span className="w-8 shrink-0 text-sm text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="min-w-0 flex-1 text-center font-semibold tracking-[-0.03em] text-[clamp(36px,6vw,88px)] transition-transform duration-[400ms] ease-[ease] [@media(hover:hover)]:group-hover:translate-x-4">
                  {project.title}
                </h3>

                <span className="text-right text-sm text-muted">
                  <span className="block">{project.category}</span>
                  <span className="block">
                    {project.year} · {project.duration}
                  </span>
                </span>
              </div>

              {project.images[0] && (
                <div className="mt-6 hidden aspect-[4/3] w-full overflow-hidden rounded-lg [@media(hover:none)]:block">
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div
        ref={previewRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-40 h-[240px] w-[320px] overflow-hidden rounded-lg border border-border bg-surface transition-opacity duration-200 [@media(hover:none)]:hidden ${
          previewSrc ? "opacity-100" : "opacity-0"
        }`}
      >
        {previewSrc && (
          <Image
            src={previewSrc}
            alt=""
            width={320}
            height={240}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </>
  );
}
