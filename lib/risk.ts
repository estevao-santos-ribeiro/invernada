import { RISK_CONFIG, type RiskLevel } from "@/config/risk-config";
import type { MonthlyHistory } from "@/lib/schemas/operation";

export function getRiskBracket(score: number) {
  if (score <= RISK_CONFIG.brackets.low.max) {
    return RISK_CONFIG.brackets.low;
  }
  if (score <= RISK_CONFIG.brackets.medium.max) {
    return RISK_CONFIG.brackets.medium;
  }
  return RISK_CONFIG.brackets.high;
}

export function getRiskLevel(score: number): RiskLevel {
  return getRiskBracket(score).level;
}

export function getRiskLabel(score: number): string {
  return getRiskBracket(score).label;
}

export function getRiskColorHex(score: number): string {
  return getRiskBracket(score).hex;
}

export function getRiskBadgeClass(score: number): string {
  return getRiskBracket(score).badgeClass;
}

export type TrendDirection = "up" | "stable" | "down";

export const TREND_LABELS: Record<TrendDirection, string> = {
  up: "Risco em alta",
  stable: "Risco estável",
  down: "Risco em queda",
};

/** Tendência da nota entre o primeiro e o último mês do histórico. */
export function getRiskTrend(history: MonthlyHistory[]) {
  const first = history[0]?.score ?? 0;
  const last = history[history.length - 1]?.score ?? 0;
  const delta = last - first;
  const { threshold } = RISK_CONFIG.trend;
  const direction: TrendDirection =
    delta >= threshold ? "up" : delta <= -threshold ? "down" : "stable";

  return { delta, direction, label: TREND_LABELS[direction] };
}

export function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : String(delta);
}
