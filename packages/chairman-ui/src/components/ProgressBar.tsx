import React from "react";

interface ProgressBarProps {
  value: number;   // 0–100
  label?: string;
  sublabel?: string;
  variant?: "default" | "warning" | "critical";
  className?: string;
}

export function ProgressBar({
  value,
  label,
  sublabel,
  variant = "default",
  className = "",
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const trackColor =
    variant === "critical"
      ? "bg-red-500"
      : variant === "warning"
        ? "bg-amber-500"
        : "bg-amber-600";

  return (
    <div className={["space-y-1.5", className].join(" ")}>
      {(label || sublabel) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm text-zinc-300">{label}</span>}
          {sublabel && <span className="text-xs text-zinc-500">{sublabel}</span>}
        </div>
      )}
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={["h-full rounded-full transition-all duration-300", trackColor].join(" ")}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
