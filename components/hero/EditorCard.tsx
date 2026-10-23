"use client";

import { useState, useSyncExternalStore } from "react";

const DEFAULT_ACCENT = "#3D6BFF";
const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

const PRESETS = [
  { name: "blue", accent: "#3D6BFF", accent2: "#9FC0FF" },
  { name: "violet", accent: "#8B5CF6", accent2: "#C4B5FD" },
  { name: "mint", accent: "#10B981", accent2: "#6EE7B7" },
  { name: "amber", accent: "#F59E0B", accent2: "#FCD34D" },
  { name: "rose", accent: "#F43F5E", accent2: "#FDA4AF" },
];

const subscribe = () => () => {};

function getAccentSnapshot() {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim() || DEFAULT_ACCENT
  );
}

function getServerSnapshot() {
  return DEFAULT_ACCENT;
}

function mixWithWhite(hex: string) {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((index) =>
    parseInt(value.slice(index, index + 2), 16)
  );
  return `#${channels
    .map((channel) => Math.round(channel + (255 - channel) * 0.55))
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

function applyAccent(hex: string) {
  const root = document.documentElement;
  root.style.setProperty("--accent", hex);
  root.style.setProperty("--accent-2", mixWithWhite(hex));
}

export default function EditorCard() {
  const [input, setInput] = useState<string | null>(null);
  const computedAccent = useSyncExternalStore(
    subscribe,
    getAccentSnapshot,
    getServerSnapshot
  );

  const value = input ?? computedAccent.toUpperCase();
  const valid = HEX_PATTERN.test(value);

  const onChange = (next: string) => {
    setInput(next);
    if (HEX_PATTERN.test(next)) {
      applyAccent(next);
    }
  };

  const applyPreset = (accent: string, accent2: string) => {
    const root = document.documentElement;
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-2", accent2);
    setInput(accent);
  };

  const reset = () => {
    applyPreset(DEFAULT_ACCENT, "#9FC0FF");
  };

  return (
    <div className="px-4 py-4">
      <div className="font-mono text-[13px] leading-6 text-text">
        <div>{":root {"}</div>
        <div>
          {"  --accent: "}
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            maxLength={7}
            spellCheck={false}
            aria-label="accent colour hex"
            data-cursor="hover"
            className="w-[80px] bg-transparent font-mono text-[13px] text-[var(--accent-2)] outline-none"
            style={{
              borderBottom: `1px solid ${
                valid ? "var(--border)" : "#F87171"
              }`,
            }}
          />
          {";"}
        </div>
        <div>{"}"}</div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {PRESETS.map((preset) => {
          const active =
            value.toLowerCase() === preset.accent.toLowerCase();
          return (
            <button
              key={preset.name}
              type="button"
              aria-label={`Use ${preset.name} colours`}
              data-cursor="hover"
              onClick={() => applyPreset(preset.accent, preset.accent2)}
              className="h-[22px] w-[22px] rounded-full"
              style={{
                backgroundColor: preset.accent,
                boxShadow: active ? "0 0 0 2px #fff" : undefined,
              }}
            />
          );
        })}
      </div>

      <button
        type="button"
        data-cursor="hover"
        onClick={reset}
        className="mt-3 appearance-none border-0 bg-transparent p-0 text-[12px] text-muted underline underline-offset-2 transition-colors hover:text-text"
      >
        reset
      </button>

      <p className="mt-3 text-[12px] text-muted">
        Try it: the whole page changes.
      </p>
    </div>
  );
}
