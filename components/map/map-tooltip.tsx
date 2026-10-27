import type { Operation } from "@/lib/schemas/operation";
import { formatDelta, getRiskTrend } from "@/lib/risk";
import { formatNumberBR } from "@/lib/formatters";

function Stat({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-semibold leading-none">{value}</span>
        <span className="text-[10px] opacity-80">{unit}</span>
      </div>
      <p className="mt-1 text-[9px] opacity-85">{label}</p>
    </div>
  );
}

/** Conteúdo do tooltip translúcido exibido sobre o marcador selecionado. */
export function MapTooltipContent({ operation }: { operation: Operation }) {
  const trend = getRiskTrend(operation.monthlyHistory);

  return (
    <div className="flex gap-6 font-sans">
      <Stat value={String(operation.fixedRiskScore)} unit="/100" label="Nota de risco" />
      <Stat value={formatDelta(trend.delta)} unit="pts" label="Variação 6 meses" />
      <Stat value={formatNumberBR(operation.headCount)} unit="cab." label="Rebanho" />
    </div>
  );
}
