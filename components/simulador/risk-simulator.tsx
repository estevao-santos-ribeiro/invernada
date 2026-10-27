"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  ChevronRight,
  Flame,
  Snowflake,
  DollarSign,
  Scale,
} from "lucide-react";
import { operations } from "@/lib/operations";
import {
  DEFAULT_WEIGHTS,
  type Weights,
  clamp,
  F,
  PRICE,
} from "@/lib/indicator";
import { getRiskBracket } from "@/lib/risk";
import { formatCurrencyBRL } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function RiskSimulator() {
  // Pesos do modelo
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);

  // Sliders de Cenário "E se?"
  const [extraFrosts, setExtraFrosts] = useState<number>(0); // 0 a +8 geadas
  const [ndviDrop, setNdviDrop] = useState<number>(0); // -30% a +10%
  const [weightLossDev, setWeightLossDev] = useState<number>(0); // -25 kg a +15 kg
  const [cattlePriceDelta, setCattlePriceDelta] = useState<number>(0); // -R$ 3,00 a +R$ 3,00

  // Presets
  const applyPreset = (preset: "default" | "guarantee" | "climate") => {
    if (preset === "default") {
      setWeights(DEFAULT_WEIGHTS);
      setExtraFrosts(0);
      setNdviDrop(0);
      setWeightLossDev(0);
      setCattlePriceDelta(0);
    } else if (preset === "guarantee") {
      setWeights({ clima: 10, pasto: 10, rebanho: 20, garantia: 60 });
    } else if (preset === "climate") {
      setWeights({ clima: 30, pasto: 30, rebanho: 20, garantia: 20 });
    }
  };

  // Simulação nas 16 fazendas da carteira
  const simulatedResults = useMemo(() => {
    const totalW = weights.clima + weights.pasto + weights.rebanho + weights.garantia || 1;

    return operations.map((op) => {
      // Cálculo no mês de Junho (pico de inverno)
      const baseHistory = op.monthlyHistory[2] ?? op.monthlyHistory[0];
      const baseScore = baseHistory?.score ?? op.fixedRiskScore;

      // Aplica choque de variáveis
      const simClima = clamp(
        (baseHistory?.clima ?? 70) - extraFrosts * 8
      );
      const simPasto = clamp(
        (baseHistory?.pasto ?? 65) + ndviDrop * 1.2
      );
      const simRebanho = clamp(
        (baseHistory?.rebanho ?? 75) + weightLossDev * 2.5
      );

      // Choque no valor da garantia
      const originalCov = baseHistory?.cov ?? 1.5;
      const basePrice = PRICE[2] ?? 13.05;
      const simPrice = Math.max(8, basePrice + cattlePriceDelta);
      const simCov = originalCov * (simPrice / basePrice) * (1 + weightLossDev / (baseHistory?.peso ?? 230));
      const simGarantia = F.garantia(simCov);

      const simScore = Math.round(
        (weights.clima * simClima +
          weights.pasto * simPasto +
          weights.rebanho * simRebanho +
          weights.garantia * simGarantia) /
          totalW
      );

      return {
        ...op,
        baseScore,
        simScore,
        delta: simScore - baseScore,
        simCov: Math.round(simCov * 100) / 100,
      };
    }).sort((a, b) => a.simScore - b.simScore); // Pior risco primeiro
  }, [weights, extraFrosts, ndviDrop, weightLossDev, cattlePriceDelta]);

  const highRiskCount = simulatedResults.filter((r) => r.simScore < 50).length;
  const medRiskCount = simulatedResults.filter(
    (r) => r.simScore >= 50 && r.simScore < 70
  ).length;
  const lowRiskCount = simulatedResults.filter((r) => r.simScore >= 70).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            Simulador de Cenários de Risco (“E se?”)
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Teste choques climáticos, quebra de pastagem, desvio de ganho de peso e preço da arroba
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset("default")}
            className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar Padrão
          </button>
        </div>
      </div>

      {/* Seção de Controles: Choques + Pesos */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Painel de Choques de Cenário */}
        <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-zinc-700" />
              Choques de Cenário em Junho/2026
            </h2>
            <span className="text-[11px] font-medium text-zinc-500">
              Impacto imediato na carteira
            </span>
          </div>

          <div className="space-y-4">
            {/* Geadas extras */}
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-700">
                <span className="flex items-center gap-1.5">
                  <Snowflake className="h-3.5 w-3.5 text-blue-500" />
                  Geadas adicionais no mês:
                </span>
                <span className="font-bold text-zinc-950">
                  {extraFrosts > 0 ? `+${extraFrosts} dias` : "0 (observado)"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={extraFrosts}
                onChange={(e) => setExtraFrosts(parseInt(e.target.value, 10))}
                className="mt-2 w-full accent-zinc-950 cursor-pointer"
              />
            </div>

            {/* Queda de NDVI */}
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-700">
                <span className="flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-amber-500" />
                  Anomalia adicional na pastagem (NDVI):
                </span>
                <span className="font-bold text-zinc-950">
                  {ndviDrop > 0 ? `+${ndviDrop}%` : `${ndviDrop}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="10"
                step="5"
                value={ndviDrop}
                onChange={(e) => setNdviDrop(parseInt(e.target.value, 10))}
                className="mt-2 w-full accent-zinc-950 cursor-pointer"
              />
            </div>

            {/* Desvio peso gado */}
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-700">
                <span className="flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-emerald-600" />
                  Desvio médio no ganho de peso do lote:
                </span>
                <span className="font-bold text-zinc-950">
                  {weightLossDev > 0 ? `+${weightLossDev} kg` : `${weightLossDev} kg`}
                </span>
              </div>
              <input
                type="range"
                min="-25"
                max="15"
                step="1"
                value={weightLossDev}
                onChange={(e) => setWeightLossDev(parseInt(e.target.value, 10))}
                className="mt-2 w-full accent-zinc-950 cursor-pointer"
              />
            </div>

            {/* Preço arroba boi gordo */}
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-700">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-zinc-600" />
                  Variação no preço do boi gordo (R$/kg vivo):
                </span>
                <span className="font-bold text-zinc-950">
                  {cattlePriceDelta >= 0
                    ? `+R$ ${cattlePriceDelta.toFixed(2)}`
                    : `-R$ ${Math.abs(cattlePriceDelta).toFixed(2)}`}
                </span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.5"
                value={cattlePriceDelta}
                onChange={(e) => setCattlePriceDelta(parseFloat(e.target.value))}
                className="mt-2 w-full accent-zinc-950 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Calibrador de Pesos do Indicador */}
        <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-950">
              Calibrador de Pesos das Variáveis
            </h2>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset("guarantee")}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-200"
              >
                Foco Garantia
              </button>
              <button
                type="button"
                onClick={() => applyPreset("climate")}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-200"
              >
                Foco Clima
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-700">
                <span>Peso Clima:</span>
                <span className="font-bold text-zinc-950">{weights.clima}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={weights.clima}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, clima: parseInt(e.target.value, 10) }))
                }
                className="mt-1 w-full accent-zinc-950 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-700">
                <span>Peso Pastagem (NDVI):</span>
                <span className="font-bold text-zinc-950">{weights.pasto}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={weights.pasto}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, pasto: parseInt(e.target.value, 10) }))
                }
                className="mt-1 w-full accent-zinc-950 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-700">
                <span>Peso Rebanho (Ganho de peso):</span>
                <span className="font-bold text-zinc-950">{weights.rebanho}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={weights.rebanho}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, rebanho: parseInt(e.target.value, 10) }))
                }
                className="mt-1 w-full accent-zinc-950 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-700">
                <span>Peso Garantia (Índice de Cobertura):</span>
                <span className="font-bold text-zinc-950">{weights.garantia}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={weights.garantia}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, garantia: parseInt(e.target.value, 10) }))
                }
                className="mt-1 w-full accent-zinc-950 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resumo do Impacto na Carteira */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-xs font-bold">Alto Risco (&lt; 50)</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-900">
            {highRiskCount}{" "}
            <span className="text-xs font-normal text-rose-700">operações</span>
          </div>
          <p className="mt-1 text-[11px] text-rose-700">
            Exigem atenção imediata e contato do analista
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold">Risco Moderado (50–69)</span>
            <TrendingDown className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-900">
            {medRiskCount}{" "}
            <span className="text-xs font-normal text-amber-700">operações</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-700">
            Monitorar evolução no próximo mês
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold">Baixo Risco (≥ 70)</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-900">
            {lowRiskCount}{" "}
            <span className="text-xs font-normal text-emerald-700">operações</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-700">
            Suplementadas ou com cobertura folgada
          </p>
        </div>
      </div>

      {/* Tabela de Classificação Pós-Simulação */}
      <section className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-950">
          Classificação Reordenada da Carteira Pecuária
        </h2>
        <p className="text-xs text-zinc-500">
          Resultados ordenados por maior risco pós-choque (menor score primeiro)
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400">
                <th className="pb-3 font-medium">Operação</th>
                <th className="pb-3 font-medium">Município</th>
                <th className="pb-3 font-medium">Financiamento</th>
                <th className="pb-3 font-medium">Score Observado</th>
                <th className="pb-3 font-medium">Score Simulado</th>
                <th className="pb-3 font-medium">Variação</th>
                <th className="pb-3 font-medium">Cobertura Estimada</th>
                <th className="pb-3 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {simulatedResults.map((op) => {
                const simBracket = getRiskBracket(op.simScore);
                return (
                  <tr key={op.id} className="hover:bg-zinc-50/80">
                    <td className="py-3">
                      <p className="font-semibold text-zinc-900">{op.farmName}</p>
                      <p className="text-[11px] text-zinc-500">{op.producerName}</p>
                    </td>
                    <td className="py-3 text-zinc-600">{op.municipality}</td>
                    <td className="py-3 font-medium text-zinc-900">
                      {formatCurrencyBRL(op.financedAmount)}
                    </td>
                    <td className="py-3 text-zinc-600 font-mono">
                      {op.baseScore} pts
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-bold text-xs",
                          simBracket.badgeClass
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            simBracket.bgClass
                          )}
                        />
                        {op.simScore}
                      </span>
                    </td>
                    <td className="py-3 font-semibold font-mono">
                      <span
                        className={
                          op.delta < 0
                            ? "text-rose-600"
                            : op.delta > 0
                            ? "text-emerald-600"
                            : "text-zinc-500"
                        }
                      >
                        {op.delta > 0 ? `+${op.delta}` : op.delta} pts
                      </span>
                    </td>
                    <td className="py-3 text-zinc-700 font-mono">
                      {op.simCov.toFixed(2)}x
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/operacoes/${op.id}`}
                        className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-800 hover:bg-zinc-200"
                      >
                        Detalhar
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
