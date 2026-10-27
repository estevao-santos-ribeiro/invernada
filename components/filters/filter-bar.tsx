"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import type { RiskLevel } from "@/config/risk-config";
import type { Operation } from "@/lib/schemas/operation";
import type { TrendDirection } from "@/lib/risk";
import {
  countActiveFilters,
  EMPTY_FILTERS,
  uniqueSorted,
  type OperationFilters,
} from "@/lib/filters";
import { cn } from "@/lib/utils";
import { FilterPill, type FilterOption } from "./filter-pill";

interface FilterBarProps {
  operations: Operation[];
  filters: OperationFilters;
  onChange: (next: OperationFilters) => void;
  className?: string;
  children?: React.ReactNode;
}

const RISK_OPTIONS: FilterOption<RiskLevel>[] = [
  { value: "high", label: "Alto Risco (67–100)" },
  { value: "medium", label: "Risco Moderado (34–66)" },
  { value: "low", label: "Baixo Risco (0–33)" },
];

const TREND_OPTIONS: FilterOption<TrendDirection>[] = [
  { value: "up", label: "Risco em alta" },
  { value: "stable", label: "Risco estável" },
  { value: "down", label: "Risco em queda" },
];

export function FilterBar({ operations, filters, onChange, className, children }: FilterBarProps) {
  const herdOptions = useMemo(
    () => uniqueSorted(operations.map((op) => op.herdType)).map((v) => ({ value: v, label: v })),
    [operations]
  );
  const municipalityOptions = useMemo(
    () => uniqueSorted(operations.map((op) => op.municipality)).map((v) => ({ value: v, label: v })),
    [operations]
  );
  const active = countActiveFilters(filters);

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-1", className)}>
      <FilterPill
        label="Rebanho"
        options={herdOptions}
        selected={filters.herdTypes}
        onChange={(herdTypes) => onChange({ ...filters, herdTypes })}
      />
      <FilterPill
        label="Faixa de risco"
        options={RISK_OPTIONS}
        selected={filters.riskLevels}
        onChange={(riskLevels) => onChange({ ...filters, riskLevels })}
      />
      <FilterPill
        label="Município"
        options={municipalityOptions}
        selected={filters.municipalities}
        onChange={(municipalities) => onChange({ ...filters, municipalities })}
      />
      <FilterPill
        label="Tendência"
        options={TREND_OPTIONS}
        selected={filters.trends}
        onChange={(trends) => onChange({ ...filters, trends })}
      />
      {active > 0 && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-zinc-700 shadow-md hover:bg-white"
        >
          <X className="h-3.5 w-3.5" />
          Limpar filtros
        </button>
      )}
      {children}
    </div>
  );
}
