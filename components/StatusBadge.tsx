"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/data/site";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: site.status.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 30_000);
  return () => window.clearInterval(id);
}

function getSnapshot() {
  return timeFormatter.format(new Date());
}

function getServerSnapshot() {
  return "";
}

export default function StatusBadge() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-[13px] text-muted"
      style={{
        backgroundColor: "color-mix(in srgb, var(--surface) 60%, transparent)",
      }}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-60"
          style={{ animationDuration: "2.4s" }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34D399]" />
      </span>
      <span>{site.status.text}</span>
      <span aria-hidden>·</span>
      <span>{site.status.location}</span>
      {time ? (
        <>
          <span aria-hidden>·</span>
          <span>{time}</span>
        </>
      ) : null}
    </div>
  );
}
