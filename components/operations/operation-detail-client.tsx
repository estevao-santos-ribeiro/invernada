"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Code2,
  RotateCcw,
} from "lucide-react";
import type { Operation } from "@/lib/schemas/operation";
import {
  computeOperationMonths,
  getReasons,
  getChecks,
  getMockApiResponse,
  MONTHS_FULL,
  DEFAULT_WEIGHTS,
  type MonthIndex,
} from "@/lib/indicator";
import { getRiskBracket, formatDelta } from "@/lib/risk";
import { formatNumberBR } from "@/lib/formatters";
import { FarmGallery } from "@/components/farm/farm-gallery";
import { FarmHeading, FarmAmount, FarmTags } from "@/components/farm/farm-details";
import { StatTile } from "@/components/farm/stat-tile";
import { RiskTrendChart } from "@/components/operations/risk-trend-chart";
import { TimelineSelector } from "@/components/operations/timeline-selector";
import { WaterfallChart } from "@/components/operations/waterfall-chart";

interface OperationDetailClientProps {
  operation: Operation;
}

export function OperationDetailClient({ operation }: OperationDetailClientProps) {
  const [selectedMonth, setSelectedMonth] = useState<MonthIndex>(2); // Jun/26 por padrão
  const [registeredWeights, setRegisteredWeights] = useState<Record<number, number>>({});
  const [weightInput, setWeightInput] = useState<string>("");

  // Base de dados para o motor de cálculo
  const baseOp = useMemo(() => {
    return {
      id: operation.id,
      farmName: operation.farmName,
      producerName: operation.producerName,
      municipality: operation.municipality,
      state: operation.state,
      latitude: operation.latitude,
      longitude: operation.longitude,
      financedAmount: operation.financedAmount,
      herdType: operation.herdType,
      headCount: operation.headCount,
      initialWeight: operation.initialWeight ?? 230,
      initialCoverage: operation.initialCoverage ?? 1.5,
      region: (operation.region as "lages" | "alta") ?? "lages",
      weightProfile: operation.weightProfile ?? [0, 6, 0, 0, 6, 15, 24],
      notes: operation.notes,
    };
  }, [operation]);

  // Recalcula série com base em pesagens informadas
  const rows = useMemo(() => {
    return computeOperationMonths(baseOp, DEFAULT_WEIGHTS, registeredWeights);
  }, [baseOp, registeredWeights]);

  const currentRow = rows[selectedMonth] ?? rows[0];
  const currentBracket = getRiskBracket(currentRow.score);
  const reasons = useMemo(
    () => getReasons(baseOp, rows, selectedMonth),
    [baseOp, rows, selectedMonth]
  );
  const checks = useMemo(
    () => getChecks(baseOp, rows, selectedMonth),
    [baseOp, rows, selectedMonth]
  );
  const mockApi = useMemo(
    () => getMockApiResponse(baseOp, rows, selectedMonth, DEFAULT_WEIGHTS),
    [baseOp, rows, selectedMonth]
  );

  // Formata série histórica para o RiskTrendChart
  const chartData = useMemo(() => {
    return rows.map((r) => ({
      month: `${r.monthName}/26`,
      score: r.score,
      clima: r.sub.clima,
      pasto: r.sub.pasto,
      rebanho: r.sub.rebanho,
      garantia: r.sub.garantia,
    }));
  }, [rows]);

  const handleApplyWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightInput.replace(",", "."));
    if (!isNaN(val) && val > 50 && val < 1000) {
      setRegisteredWeights((prev) => ({
        ...prev,
        [selectedMonth]: val,
      }));
      setWeightInput("");
    }
  };

  const handleResetWeight = () => {
    setRegisteredWeights((prev) => {
      const next = { ...prev };
      delete next[selectedMonth];
      return next;
    });
    setWeightInput("");
  };

  const isCustomWeight = registeredWeights[selectedMonth] != null;

  return (
    <div className="space-y-4">
      {/* Barra de navegação superior */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/operacoes"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Operações
        </Link>
        <TimelineSelector
          selectedMonth={selectedMonth}
          onChange={setSelectedMonth}
        />
      </div>

      {/* Grid Principal */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)]">
        {/* Coluna da Esquerda: Dados da Propriedade e Pesagem */}
        <div className="space-y-4">
          <article className="space-y-5 rounded-[24px] bg-white p-5 shadow-sm">
            <FarmGallery
              latitude={operation.latitude}
              longitude={operation.longitude}
              className="h-[280px]"
            />

            <div className="space-y-5 px-1">
              <FarmHeading
                operation={{
                  ...operation,
                  fixedRiskScore: currentRow.score,
                }}
                size="lg"
                as="h1"
                action={
                  <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 font-mono text-xs font-semibold text-zinc-600">
                    {operation.id}
                  </span>
                }
              />

              <p className="text-sm leading-relaxed text-zinc-600">
                Financiamento de {operation.producerName}, lote de{" "}
                {operation.herdType.toLowerCase()} com {formatNumberBR(operation.headCount)}{" "}
                cabeças em {operation.municipality} (região {baseOp.region === "alta" ? "Serra Alta" : "Lages e entorno"}).
              </p>

              {/* Estatísticas no Mês Selecionado */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <StatTile
                  icon={ShieldCheck}
                  value={String(currentRow.score)}
                  unit="/100"
                  label={`Score (${currentRow.monthName})`}
                  valueClassName={currentBracket.textClass}
                />
                <StatTile
                  icon={Calendar}
                  value={formatDelta(currentRow.score - rows[0].score)}
                  unit="pts"
                  label="Variação safra"
                />
                <StatTile
                  icon={Scale}
                  value={String(currentRow.peso)}
                  unit="kg"
                  label="Peso médio/cab"
                />
                <StatTile
                  icon={Sparkles}
                  value={`${currentRow.cov.toFixed(2)}x`}
                  unit=""
                  label="Cobertura garantia"
                />
              </div>

              {/* Tags e badges */}
              <div className="border-t border-zinc-100 pt-4">
                <FarmTags
                  operation={{
                    ...operation,
                    fixedRiskScore: currentRow.score,
                  }}
                />
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <FarmAmount value={currentRow.saldo} />
              </div>
            </div>
          </article>

          {/* Card de Simulação / Registro de Pesagem */}
          <section className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <Scale className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-950">
                    Registrar pesagem de {MONTHS_FULL[selectedMonth]}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    O produtor informou novo peso? Simule ou recalcule na hora.
                  </p>
                </div>
              </div>
              {isCustomWeight && (
                <button
                  type="button"
                  onClick={handleResetWeight}
                  title="Restaurar valor original"
                  className="flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100"
                >
                  <RotateCcw className="h-3 w-3" />
                  Restaurar
                </button>
              )}
            </div>

            <form onSubmit={handleApplyWeight} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder={`Peso atual: ${currentRow.peso} kg`}
                  className="w-full rounded-full border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                  kg/cab.
                </span>
              </div>
              <button
                type="submit"
                disabled={!weightInput}
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-zinc-950 px-5 py-2 text-xs font-semibold text-white transition-opacity hover:bg-zinc-800 disabled:opacity-40"
              >
                Recalcular score
              </button>
            </form>

            <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500">
              <Info className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span>
                Previsto no plano sazonal para {currentRow.monthName}:{" "}
                <strong>{currentRow.pesoPlano} kg</strong> (desvio atual:{" "}
                <strong
                  className={
                    currentRow.dev >= 0 ? "text-emerald-700" : "text-rose-700"
                  }
                >
                  {currentRow.dev > 0 ? `+${currentRow.dev}` : currentRow.dev} kg
                </strong>
                ).
              </span>
            </div>
          </section>
        </div>

        {/* Coluna da Direita: Inteligência de Risco UNIPLAC */}
        <div className="space-y-4">
          {/* Evolução temporal */}
          <section className="rounded-[24px] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-zinc-950">
                  Evolução da nota ao longo da safra 2026
                </h2>
                <p className="text-xs text-zinc-500">
                  Faixas: ≥ 70 baixo risco · 50–69 moderado · &lt; 50 alto risco
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                Mês em foco: {currentRow.monthName}
              </span>
            </div>
            <RiskTrendChart data={chartData} />
          </section>

          {/* De onde veio a mudança: Waterfall Decomposition */}
          <section className="rounded-[24px] bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-zinc-950">
              De onde veio a mudança (Waterfall)
            </h2>
            <p className="text-xs text-zinc-500">
              Contribuição de cada variável na variação da nota de Abril a {currentRow.monthName}/2026
            </p>
            <div className="mt-3">
              <WaterfallChart rows={rows} selectedMonth={selectedMonth} />
            </div>
          </section>

          {/* Por que a nota mudou: 4 Variáveis em Linguagem Simples */}
          <section className="rounded-[24px] bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-zinc-950">
              Por que a nota mudou em {currentRow.monthName}
            </h2>
            <p className="text-xs text-zinc-500">
              Diagnóstico detalhado dos 4 sinais de campo
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {reasons.map((r) => (
                <div
                  key={r.k}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-3.5 transition-colors hover:bg-zinc-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900">{r.label}</span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-zinc-700 shadow-xs">
                      Subnota: {currentRow.sub[r.k]}/100
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Pontos para verificar (Tom estritamente neutro) */}
          <section className="rounded-[24px] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h2 className="text-base font-semibold tracking-tight text-zinc-950">
                Pontos para verificar
              </h2>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Sugestões neutras geradas para apoiar a checagem com o cooperado
            </p>

            {checks.length === 0 ? (
              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-xs text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Nenhum desvio crítico identificado para este mês.</span>
              </div>
            ) : (
              <ul className="mt-3 space-y-2">
                {checks.map((chk, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 text-xs text-zinc-700"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span className="leading-relaxed">{chk}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Aviso de conformidade / LGPD Art. 20 */}
            <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-[11px] leading-relaxed text-zinc-500">
              <p>
                <strong>Nota de conformidade:</strong> Este indicador apoia a análise de risco; a
                decisão de concessão e acompanhamento do crédito é do analista. Em conformidade com o
                Artigo 20 da LGPD (Lei 13.709/2018), os parâmetros do modelo são explicáveis,
                auditáveis e utilizam dados públicos e cadastrais sem decisões automatizadas restritivas.
              </p>
            </div>
          </section>

          {/* Resposta simulada da API (GET /v1/operacoes/{id}/score?mes=2026-XX) */}
          <details className="group rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold text-zinc-800 hover:text-zinc-950">
              <span className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-emerald-600" />
                API REST Simulada: GET /v1/operacoes/{operation.id}/score?mes=2026-
                {String(selectedMonth + 4).padStart(2, "0")}
              </span>
              <span className="text-[11px] font-normal text-zinc-400 group-open:hidden">
                Clique para ver JSON
              </span>
            </summary>
            <div className="mt-3 overflow-hidden rounded-xl bg-zinc-950 p-3 font-mono text-[11px] text-emerald-400">
              <pre className="overflow-x-auto leading-relaxed">
                {JSON.stringify(mockApi, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
