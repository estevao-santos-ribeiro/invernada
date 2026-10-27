import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-emerald-700 text-white shadow hover:bg-emerald-800",
    secondary: "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    destructive: "border-transparent bg-rose-600 text-white shadow hover:bg-rose-700",
    outline: "text-zinc-950 border border-zinc-200",
  }[variant];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2",
        variantStyles,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
