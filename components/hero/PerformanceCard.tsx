"use client";

import { useEffect, useState } from "react";

type Metrics = {
  load: number | null;
  firstPaint: number | null;
  weight: number | null;
  requests: number | null;
};

const LOAD_SCALE = 3000;
const PAINT_SCALE = 2500;
const WEIGHT_SCALE = 3 * 1024 * 1024;
const REQUEST_SCALE = 60;

function formatDuration(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`;
}

function formatWeight(bytes: number) {
  if (bytes === 0) return "cached";
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

function readMetrics(): Metrics {
  const metrics: Metrics = {
    load: null,
    firstPaint: null,
    weight: null,
    requests: null,
  };

  try {
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (
      navigation &&
      Number.isFinite(navigation.loadEventEnd) &&
      navigation.loadEventEnd > 0
    ) {
      metrics.load = navigation.loadEventEnd - navigation.startTime;
    }
  } catch {
    metrics.load = null;
  }

  try {
    const paints = performance.getEntriesByType("paint");
    const firstContentfulPaint = paints.find(
      (entry) => entry.name === "first-contentful-paint"
    );
    if (
      firstContentfulPaint &&
      Number.isFinite(firstContentfulPaint.startTime)
    ) {
      metrics.firstPaint = firstContentfulPaint.startTime;
    }
  } catch {
    metrics.firstPaint = null;
  }

  try {
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];
    const total = resources.reduce(
      (sum, entry) => sum + (entry.transferSize || 0),
      0
    );
    metrics.weight = total + (navigation?.transferSize || 0);
    metrics.requests = resources.length;
  } catch {
    metrics.weight = null;
    metrics.requests = null;
  }

  return metrics;
}

function barWidth(value: number | null, scale: number, progress: number) {
  if (value === null) return 0;
  return Math.min(100, Math.max(0, (value / scale) * 100)) * progress;
}

export default function PerformanceCard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let measureTimer: number | undefined;
    let frame = 0;
    let disposed = false;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const measure = () => {
      if (disposed) return;
      setMetrics(readMetrics());
      if (reduced) {
        setProgress(1);
        return;
      }

      const start = performance.now();
      const animate = (now: number) => {
        if (disposed) return;
        const t = Math.min(1, (now - start) / 800);
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(eased);
        if (t < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    };

    const schedule = () => {
      measureTimer = window.setTimeout(measure, 100);
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      disposed = true;
      window.removeEventListener("load", schedule);
      window.clearTimeout(measureTimer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const loadText = metrics
    ? metrics.load === null
      ? "n/a"
      : formatDuration(metrics.load * progress)
    : "measuring…";

  const paintText = metrics
    ? metrics.firstPaint === null
      ? "n/a"
      : formatDuration(metrics.firstPaint * progress)
    : "measuring…";

  const weightText = metrics
    ? metrics.weight === null
      ? "n/a"
      : formatWeight(metrics.weight * progress)
    : "measuring…";

  const requestsText = metrics
    ? metrics.requests === null
      ? "n/a"
      : String(Math.round(metrics.requests * progress))
    : "measuring…";

  const rows = [
    {
      label: "Load time",
      value: loadText,
      width: metrics
        ? barWidth(metrics.load, LOAD_SCALE, progress)
        : 0,
    },
    {
      label: "First paint",
      value: paintText,
      width: metrics
        ? barWidth(metrics.firstPaint, PAINT_SCALE, progress)
        : 0,
    },
    {
      label: "Page weight",
      value: weightText,
      width: metrics
        ? barWidth(metrics.weight, WEIGHT_SCALE, progress)
        : 0,
    },
    {
      label: "Requests",
      value: requestsText,
      width: metrics
        ? barWidth(metrics.requests, REQUEST_SCALE, progress)
        : 0,
    },
  ];

  return (
    <div className="p-4">
      <div className="font-mono text-[13px]">
        {rows.map((row) => (
          <div key={row.label} className="mb-3 last:mb-0">
            <div className="flex items-center justify-between">
              <span className="text-muted">{row.label}</span>
              <span className="text-text">{row.value}</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full transition-[width] duration-[900ms] ease-out"
                style={{
                  width: `${row.width}%`,
                  background:
                    "linear-gradient(90deg, var(--accent), var(--accent-2))",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[12px] text-muted">
        Measured in your browser, just now.
      </p>
    </div>
  );
}
