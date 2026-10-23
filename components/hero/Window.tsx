import type { ReactNode } from "react";

type WindowProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

const DOTS = ["#FF5F57", "#FEBC2E", "#28C840"];

export default function Window({ title, children, className }: WindowProps) {
  return (
    <div
      className={`overflow-hidden rounded-[14px] border border-border${
        className ? ` ${className}` : ""
      }`}
      style={{
        background: "color-mix(in oklab, var(--surface) 97%, transparent)",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="relative flex items-center border-b border-border px-3 py-2">
        <div className="flex items-center gap-1.5">
          {DOTS.map((color) => (
            <span
              key={color}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[12px] text-muted">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
