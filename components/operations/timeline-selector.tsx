"use client";

import { MONTHS, HISTORICAL_EVENTS, type MonthIndex } from "@/lib/indicator";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface TimelineSelectorProps {
  selectedMonth: MonthIndex;
  onChange: (month: MonthIndex) => void;
  className?: string;
  compact?: boolean;
}

export function TimelineSelector({
  selectedMonth,
  onChange,
  className,
  compact = false,
}: TimelineSelectorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto rounded-full bg-white p-1 shadow-md",
        className
      )}
      role="group"
      aria-label="Linha do tempo da safra 2026"
    >
      {!compact && (
        <span className="hidden items-center gap-1.5 px-3 py-1 text-xs font-semibold text-zinc-500 xl:inline-flex">
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          Mês 2026:
        </span>
      )}
      {MONTHS.map((name, idx) => {
        const m = idx as MonthIndex;
        const isSelected = selectedMonth === m;
        const event = HISTORICAL_EVENTS[m];

        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(m)}
            className={cn(
              "group relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
              isSelected
                ? "bg-zinc-950 text-white shadow-sm"
                : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
            )}
            title={event ? `${name}/2026 — ${event}` : `${name}/2026`}
          >
            <span>{name}</span>
            {event && (
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isSelected ? "bg-amber-300" : "bg-amber-500"
                )}
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
