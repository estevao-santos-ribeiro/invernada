import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagChipProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

/** Etiqueta em pílula com ícone, como "Grid Connected" na referência. */
export function TagChip({ icon: Icon, children, className }: TagChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 text-zinc-500" />
      {children}
    </span>
  );
}
