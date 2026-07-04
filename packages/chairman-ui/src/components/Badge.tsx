import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "gold" | "locked";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  "bg-zinc-800 text-zinc-300 border border-zinc-700",
  success:  "bg-emerald-900/40 text-emerald-300 border border-emerald-800",
  warning:  "bg-amber-900/40 text-amber-300 border border-amber-800",
  error:    "bg-red-900/40 text-red-300 border border-red-800",
  gold:     "bg-amber-900/30 text-amber-400 border border-amber-700",
  locked:   "bg-zinc-900 text-zinc-500 border border-zinc-800",
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
