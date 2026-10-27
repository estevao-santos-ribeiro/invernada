import {
  Activity,
  Beef,
  FlaskConical,
  Gauge,
  MapPin,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Minus,
  Users,
} from "lucide-react";
import type { Operation } from "@/lib/schemas/operation";
import { formatDelta, getRiskBracket, getRiskTrend } from "@/lib/risk";
import { formatCompactBRL, formatNumberBR } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { StatTile } from "./stat-tile";
import { TagChip } from "./tag-chip";

function getTrendIcon(direction?: string) {
  if (direction === "up") return TrendingUp;
  if (direction === "down") return TrendingDown;
  return Minus;
}

export function FarmHeading({
  operation,
  action,
  size = "md",
  as: Heading = "h2",
}: {
  operation: Operation;
  action?: React.ReactNode;
  size?: "md" | "lg";
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <Heading
          className={cn(
            "font-semibold tracking-tight text-zinc-950",
            size === "lg" ? "text-3xl" : "text-2xl"
          )}
        >
          {operation.farmName}
        </Heading>
        <p className="mt-1 flex items-center gap-1 text-sm text-zinc-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {operation.municipality}, {operation.state}
        </p>
      </div>
      {action}
    </div>
  );
}

export function FarmDescription({ operation }: { operation: Operation }) {
  return (
    <p className="text-[13px] leading-relaxed text-zinc-600">
      Financiamento de {operation.producerName}, rebanho de{" "}
      {operation.herdType.toLowerCase()} com {formatNumberBR(operation.headCount)} cabeças.{" "}
      {operation.notes}
    </p>
  );
}

export function FarmStats({ operation }: { operation: Operation }) {
  const bracket = getRiskBracket(operation.fixedRiskScore);
  const trend = getRiskTrend(operation.monthlyHistory);

  return (
    <div className="grid grid-cols-3 gap-2">
      <StatTile
        icon={Gauge}
        value={String(operation.fixedRiskScore)}
        unit="/100"
        label="Nota de risco"
        valueClassName={bracket.textClass}
      />
      <StatTile
        icon={Activity}
        value={formatDelta(trend.delta)}
        unit="pts"
        label="Variação 6 meses"
      />
      <StatTile
        icon={Users}
        value={formatNumberBR(operation.headCount)}
        unit="cab."
        label="Rebanho"
      />
    </div>
  );
}

export function FarmTags({ operation }: { operation: Operation }) {
  const bracket = getRiskBracket(operation.fixedRiskScore);
  const trend = getRiskTrend(operation.monthlyHistory);
  const TrendIcon = getTrendIcon(trend?.direction);

  return (
    <div className="flex flex-wrap gap-2">
      <TagChip icon={ShieldAlert}>
        <span className={cn("h-1.5 w-1.5 rounded-full", bracket.bgClass)} />
        {bracket.label}
      </TagChip>
      <TagChip icon={TrendIcon}>{trend.label}</TagChip>
      {operation.monthlyHistory.some((m) => m.known === false) && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          Confiança baixa (sem pesagem)
        </span>
      )}
      <TagChip icon={Beef}>{operation.herdType}</TagChip>
      <TagChip icon={FlaskConical}>Operação simulada</TagChip>
    </div>
  );
}

export function FarmAmount({ value }: { value: number }) {
  const { amount, suffix } = formatCompactBRL(value);
  return (
    <div>
      <span className="text-2xl font-semibold tracking-tight text-zinc-950">{amount}</span>
      {suffix && <span className="ml-1 text-xs text-zinc-400">{suffix}</span>}
      <span className="block text-[11px] text-zinc-400">valor financiado</span>
    </div>
  );
}
