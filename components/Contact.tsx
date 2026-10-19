"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

const EMAIL = site.links.email;

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [portraitOk, setPortraitOk] = useState(true);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } catch {
      // copy unavailable
    }
    document.body.removeChild(textarea);
  };

  const copyEmail = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error("clipboard unavailable");
      }
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      fallbackCopy(EMAIL);
    }
    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden px-8 py-[140px]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[180px] h-[420px] w-[min(90vw,840px)] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--glow) 30%, transparent) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-center text-center">
        {portraitOk ? (
          <Image
            src="/images/ilham-portrait.jpg"
            alt="Ilham Ammar"
            width={72}
            height={72}
            onError={() => setPortraitOk(false)}
            className="h-[72px] w-[72px] rounded-full border border-border object-cover"
          />
        ) : (
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-border bg-surface text-muted">
            IA
          </div>
        )}

        <p className="mt-8 text-[13px] uppercase tracking-[0.12em] text-muted">
          Have a project?
        </p>

        <h2 className="mt-4 font-sans font-semibold tracking-[-0.03em] text-[clamp(40px,7vw,112px)]">
          Let&apos;s build{" "}
          <span className="font-serif italic text-accent">something</span>
        </h2>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${EMAIL}`}
            data-cursor="hover"
            className="rounded-full bg-accent px-7 py-3.5 text-white"
          >
            {EMAIL}
          </a>
          <button
            type="button"
            data-cursor="hover"
            aria-live="polite"
            onClick={copyEmail}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-text"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <a
            href={site.links.github}
            data-cursor="hover"
            className="text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
          >
            GitHub
          </a>
          <a
            href={site.links.linkedin}
            data-cursor="hover"
            className="text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
