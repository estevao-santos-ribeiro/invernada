import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  icon: LucideIcon;
  value: string;
  unit?: string;
  label: string;
  valueClassName?: string;
  className?: string;
}

/** Cartão de métrica: ícone em círculo, número grande, unidade e rótulo. */
export function StatTile({ icon: Icon, value, unit, label, valueClassName, className }: StatTileProps) {
  return (
    <div className={cn("rounded-2xl border border-zinc-200 bg-white p-3", className)}>
      <span className="grid h-7 w-7 place-items-center rounded-full border border-zinc-200 text-zinc-700">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={cn("text-2xl font-semibold tracking-tight text-zinc-950", valueClassName)}>
          {value}
        </span>
        {unit && <span className="text-[11px] text-zinc-400">{unit}</span>}
      </div>
      <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
    </div>
  );
}
