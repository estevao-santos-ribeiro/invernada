"use client";

import { useState } from "react";
import {
  CloudSnow,
  CloudRain,
  ThermometerSnowflake,
  Activity,
  Info,
  Calendar,
  MapPin,
} from "lucide-react";
import { REGIONS, MONTHS, HISTORICAL_EVENTS } from "@/lib/indicator";
import { cn } from "@/lib/utils";

type RegionKey = "lages" | "alta";

export function ClimateDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("lages");

  const regionData = REGIONS[selectedRegion];

  const totalGeadas = regionData.geadas.reduce((a, b) => a + b, 0);
  const totalGeadasNormal = regionData.geadasNormal.reduce((a, b) => a + b, 0);
  const avgChuva = Math.round(
    regionData.chuva.reduce((a, b) => a + b, 0) / regionData.chuva.length
  );
  const minPastagem = Math.min(...regionData.pastoAnom);

  return (
    <div className="space-y-6">
      {/* Header com seletor de região */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            Monitor Climático da Serra Catarinense
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Dados agroclimáticos observados na safra 2026 (INMET Lages A882 / Epagri-Ciram)
          </p>
        </div>

        <div className="flex shrink-0 items-center rounded-full bg-white p-1 shadow-sm border border-zinc-200">
          <button
            type="button"
            onClick={() => setSelectedRegion("lages")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              selectedRegion === "lages"
                ? "bg-zinc-950 text-white"
                : "text-zinc-600 hover:text-zinc-950"
            )}
          >
            <MapPin className="h-3 w-3" />
            Lages e entorno
          </button>
          <button
            type="button"
            onClick={() => setSelectedRegion("alta")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              selectedRegion === "alta"
                ? "bg-zinc-950 text-white"
                : "text-zinc-600 hover:text-zinc-950"
            )}
          >
            <ThermometerSnowflake className="h-3 w-3" />
            Serra Alta (Urupema/Painel)
          </button>
        </div>
      </div>

      {/* Cartões de Indicadores Gerais */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Geadas Registradas</span>
            <CloudSnow className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-zinc-950">
              {totalGeadas}
            </span>
            <span className="text-xs text-zinc-500">dias</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Normal histórico: {totalGeadasNormal} dias (
            <strong className="text-rose-600">
              +{totalGeadas - totalGeadasNormal}
            </strong>{" "}
            dias acima)
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Menor Temperatura</span>
            <ThermometerSnowflake className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-zinc-950">
              {selectedRegion === "alta" ? "-9,1 °C" : "-4,2 °C"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Pico no dia 24 de Junho (onda polar)
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Chuva Média</span>
            <CloudRain className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-zinc-950">
              {avgChuva}%
            </span>
            <span className="text-xs text-zinc-500">da média</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Agosto chuvoso (160% normal)
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Anomalia NDVI Pasto</span>
            <Activity className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-rose-600">
              {minPastagem}%
            </span>
            <span className="text-xs text-zinc-500">no pico de Junho</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Queima de forragem por geada severa
          </p>
        </div>
      </div>

      {/* Linha do Tempo de Eventos Críticos da Safra */}
      <section className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-zinc-700" />
          <h2 className="text-base font-semibold text-zinc-950">
            Eventos Meteorológicos Críticos Registrados em 2026
          </h2>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Ocorrências com impacto direto no ganho de peso e capacidade de suporte das pastagens
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5">
            <span className="inline-block rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
              21/05/2026
            </span>
            <h3 className="mt-2 text-xs font-semibold text-zinc-900">
              Geadas Precoces
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
              Início antecipado do frio na Serra. 5 geadas em maio (normal histórico é 2).
              Produtores sem reserva de volumoso tiveram estagnação prematura do gado.
            </p>
          </div>

          <div className="rounded-2xl border border-rose-300 bg-rose-50/50 p-3.5 ring-1 ring-rose-200">
            <span className="inline-block rounded-full bg-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-900">
              24/06/2026
            </span>
            <h3 className="mt-2 text-xs font-semibold text-zinc-900">
              Geada Severa (-9,1 °C)
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
              Pico de frio em Urupema e planalto de Lages. Queima generalizada da pastagem
              nativa (campo limpo) e queda de até 33% no NDVI do satélite Sentinel-2.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-3.5">
            <span className="inline-block rounded-full bg-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-900">
              28 a 31/08/2026
            </span>
            <h3 className="mt-2 text-xs font-semibold text-zinc-900">
              Chuva Excessiva (160%)
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
              Precipitação 60% acima do normal. Encharcamento do solo, barro em piquetes
              e dificuldade no transporte de sal mineral e suplementos.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-3.5">
            <span className="inline-block rounded-full bg-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-900">
              17/09/2026
            </span>
            <h3 className="mt-2 text-xs font-semibold text-zinc-900">
              Geada Tardia de Primavera
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
              Retardou a rebrota das gramíneas de verão em áreas de maior altitude.
              Operações suplementadas mantiveram o ganho planejado.
            </p>
          </div>
        </div>
      </section>

      {/* Tabela Comparativa Mensal: Lages vs Serra Alta */}
      <section className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-950">
          Série Mensal Agroclimática (Abril a Outubro de 2026)
        </h2>
        <p className="text-xs text-zinc-500">
          Valores utilizados no motor do indicador de risco da cooperativa
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400">
                <th className="pb-3 font-medium">Mês</th>
                <th className="pb-3 font-medium">Geadas ({regionData.nome})</th>
                <th className="pb-3 font-medium">Normal Histórico</th>
                <th className="pb-3 font-medium">Chuva (% média)</th>
                <th className="pb-3 font-medium">Anomalia Pasto (NDVI)</th>
                <th className="pb-3 font-medium">Subnota Clima</th>
                <th className="pb-3 font-medium">Subnota Pasto</th>
                <th className="pb-3 font-medium">Evento Histórico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {MONTHS.map((m, idx) => {
                const g = regionData.geadas[idx];
                const gn = regionData.geadasNormal[idx];
                const ch = regionData.chuva[idx];
                const pa = regionData.pastoAnom[idx];
                const scClima = Math.round(
                  Math.max(
                    0,
                    Math.min(
                      100,
                      80 - 10 * Math.max(0, g - gn) -
                        0.5 * Math.max(0, 85 - ch) -
                        0.3 * Math.max(0, ch - 150)
                    )
                  )
                );
                const scPasto = Math.round(
                  Math.max(0, Math.min(100, 85 + 1.2 * pa))
                );

                return (
                  <tr key={m} className="hover:bg-zinc-50/80">
                    <td className="py-3 font-semibold text-zinc-900">
                      {m}/2026
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "font-semibold",
                          g > gn ? "text-rose-600" : "text-zinc-700"
                        )}
                      >
                        {g} dias
                      </span>
                    </td>
                    <td className="py-3 text-zinc-500">{gn} dias</td>
                    <td className="py-3">
                      <span
                        className={cn(
                          ch < 85
                            ? "text-amber-600 font-semibold"
                            : ch > 150
                            ? "text-blue-600 font-semibold"
                            : "text-zinc-700"
                        )}
                      >
                        {ch}%
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          pa < -15
                            ? "text-rose-600 font-semibold"
                            : pa < 0
                            ? "text-amber-600"
                            : "text-emerald-600"
                        )}
                      >
                        {pa > 0 ? `+${pa}%` : `${pa}%`}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-zinc-900">
                      {scClima}/100
                    </td>
                    <td className="py-3 font-semibold text-zinc-900">
                      {scPasto}/100
                    </td>
                    <td className="py-3 text-zinc-600">
                      {HISTORICAL_EVENTS[idx] || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Fontes de Dados e Auditoria */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
        <div className="flex items-center gap-2 font-semibold text-zinc-900">
          <Info className="h-4 w-4 text-zinc-500" />
          Fontes Oficiais e Rastreabilidade (Auditoria LGPD Art. 20)
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
          • <strong>Clima e Geadas:</strong> Rede de estações automáticas do Instituto Nacional de
          Meteorologia (INMET - Estação Lages A882) combinada com dados de reanálise horária do Open-Meteo
          Historical Weather API e boletins agrometeorológicos da Epagri/Ciram.
          <br />• <strong>Pastagens (NDVI):</strong> Sistema de Análise Temporal da Vegetação (SATVeg /
          Embrapa Informática Agropecuária) e constelação Copernicus Sentinel-2 MSI (resolução 10m).
        </p>
      </div>
    </div>
  );
}
