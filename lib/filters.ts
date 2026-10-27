import type { RiskLevel } from "@/config/risk-config";
import type { Operation } from "@/lib/schemas/operation";
import { getRiskLevel, getRiskTrend, type TrendDirection } from "@/lib/risk";

export interface OperationFilters {
  herdTypes: string[];
  riskLevels: RiskLevel[];
  municipalities: string[];
  trends: TrendDirection[];
}

export const EMPTY_FILTERS: OperationFilters = {
  herdTypes: [],
  riskLevels: [],
  municipalities: [],
  trends: [],
};

/** Filtros vazios significam "sem restrição". Resultado ordenado por maior risco. */
export function applyFilters(operations: Operation[], filters: OperationFilters): Operation[] {
  return operations
    .filter((op) => {
      if (filters.herdTypes.length && !filters.herdTypes.includes(op.herdType)) return false;
      if (filters.riskLevels.length && !filters.riskLevels.includes(getRiskLevel(op.fixedRiskScore)))
        return false;
      if (filters.municipalities.length && !filters.municipalities.includes(op.municipality))
        return false;
      if (filters.trends.length && !filters.trends.includes(getRiskTrend(op.monthlyHistory).direction))
        return false;
      return true;
    })
    .sort((a, b) => b.fixedRiskScore - a.fixedRiskScore);
}

export function countActiveFilters(filters: OperationFilters): number {
  return (
    filters.herdTypes.length +
    filters.riskLevels.length +
    filters.municipalities.length +
    filters.trends.length
  );
}

/** Valores distintos e ordenados de um campo, para montar as opções dos filtros. */
export function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
