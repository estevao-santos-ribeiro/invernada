import type { Metadata } from "next";
import { CheckCircle2, AlertCircle, ShieldAlert, Wallet } from "lucide-react";
import { PageSurface } from "@/components/shell/app-shell";
import { StatTile } from "@/components/farm/stat-tile";
import { OperationsBrowser } from "@/components/operations/operations-browser";
import { getOperationsSortedByRisk, getOperationsSummary } from "@/lib/operations";
import { formatCompactBRL } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Operações",
  description: "Lista de financiamentos de pecuária ordenada pela nota de risco.",
};

export default function OperacoesPage() {
  const operations = getOperationsSortedByRisk();
  const summary = getOperationsSummary();
  const total = formatCompactBRL(summary.totalFinanced);

  return (
    <PageSurface>
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Operações</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Financiamentos de pecuária acompanhados pela cooperativa. Dados simulados nesta etapa.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <StatTile icon={Wallet} value={total.amount} unit={total.suffix} label="Carteira total" />
        <StatTile
          icon={ShieldAlert}
          value={String(summary.highRiskCount)}
          unit={`de ${summary.total}`}
          label="Alto risco"
          valueClassName="text-rose-700"
        />
        <StatTile
          icon={AlertCircle}
          value={String(summary.mediumRiskCount)}
          unit={`de ${summary.total}`}
          label="Risco moderado"
          valueClassName="text-amber-700"
        />
        <StatTile
          icon={CheckCircle2}
          value={String(summary.lowRiskCount)}
          unit={`de ${summary.total}`}
          label="Baixo risco"
          valueClassName="text-emerald-700"
        />
      </div>

      <OperationsBrowser operations={operations} />
    </PageSurface>
  );
}
