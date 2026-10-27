import type { Metadata } from "next";
import { PageSurface } from "@/components/shell/app-shell";
import { DEFAULT_WEIGHTS, MIN_COVERAGE } from "@/lib/indicator";
import { ShieldCheck, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre · Campora",
  description: "Modelo de indicador de risco pecuário e garantia — UNIPLAC / Integrativa SI 2026.2.",
};

const SOURCES = [
  { name: "Esri World Imagery", use: "Mosaicos e recortes de satélite em alta resolução", status: "Em uso" },
  { name: "OpenStreetMap", use: "Camada base cartográfica e viária", status: "Em uso" },
  { name: "INMET (Estação Lages A882)", use: "Temperatura, geadas e precipitação horária", status: "Em uso" },
  { name: "Open-Meteo Historical", use: "Reanálise agroclimática e histórica por coordenada", status: "Em uso" },
  { name: "Epagri / Ciram", use: "Boletins agroclimáticos da Serra Catarinense", status: "Em uso" },
  { name: "Copernicus / Sentinel-2", use: "Índice de vigor de pastagem (NDVI 10m)", status: "Em uso" },
  { name: "SATVeg / Embrapa", use: "Séries temporais de vegetação e anomalias", status: "Em uso" },
  { name: "Cepea / Epagri-Cepa", use: "Cotações mensais do boi gordo em SC (R$/kg vivo)", status: "Em uso" },
];

export default function SobrePage() {
  return (
    <PageSurface>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              UNIPLAC · Integrativa SI 2026.2
            </span>
            <span className="text-xs text-zinc-400">Desafio 1: Pecuária de Corte</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
            Sobre o Indicador Campora
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600">
            O Campora é uma solução de monitoramento de risco e garantia para financiamentos de pecuária de corte a pasto (recria e engorda) na Serra Catarinense. O modelo combina dados de sensoriamento remoto, estações agrometeorológicas e dados informados de pesagem para oferecer explicações em linguagem simples, simulações de estresse e conformidade estrita com o Artigo 20 da LGPD.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Como o indicador é calculado */}
          <section className="rounded-[24px] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-zinc-700" />
              <h2 className="text-base font-semibold text-zinc-950">Composição do Indicador (4 Variáveis)</h2>
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-700">
              <li className="flex items-start justify-between rounded-xl bg-zinc-50 p-2.5 border border-zinc-200">
                <div>
                  <strong className="text-zinc-900">1. Clima ({DEFAULT_WEIGHTS.clima}%)</strong>
                  <span className="block text-[11px] text-zinc-500">
                    Geadas acima do normal e anomalias de precipitação (&lt;85% seca ou &gt;150% excesso)
                  </span>
                </div>
                <span className="font-mono font-semibold text-zinc-900">{DEFAULT_WEIGHTS.clima}%</span>
              </li>

              <li className="flex items-start justify-between rounded-xl bg-zinc-50 p-2.5 border border-zinc-200">
                <div>
                  <strong className="text-zinc-900">2. Pastagem ({DEFAULT_WEIGHTS.pasto}%)</strong>
                  <span className="block text-[11px] text-zinc-500">
                    Vigor do pasto medido pelo satélite Sentinel-2 e anomalia de NDVI vs histórico
                  </span>
                </div>
                <span className="font-mono font-semibold text-zinc-900">{DEFAULT_WEIGHTS.pasto}%</span>
              </li>

              <li className="flex items-start justify-between rounded-xl bg-zinc-50 p-2.5 border border-zinc-200">
                <div>
                  <strong className="text-zinc-900">3. Rebanho ({DEFAULT_WEIGHTS.rebanho}%)</strong>
                  <span className="block text-[11px] text-zinc-500">
                    Desvio de ganho de peso (kg/cabeça) vs plano sazonal da Serra Catarinense (neutro se faltar pesagem)
                  </span>
                </div>
                <span className="font-mono font-semibold text-zinc-900">{DEFAULT_WEIGHTS.rebanho}%</span>
              </li>

              <li className="flex items-start justify-between rounded-xl bg-zinc-50 p-2.5 border border-zinc-200">
                <div>
                  <strong className="text-zinc-900">4. Garantia ({DEFAULT_WEIGHTS.garantia}%)</strong>
                  <span className="block text-[11px] text-zinc-500">
                    Índice de cobertura = (rebanho × peso × R$/kg Cepea) / saldo devedor (mínimo institucional {MIN_COVERAGE.toFixed(1)}x)
                  </span>
                </div>
                <span className="font-mono font-semibold text-zinc-900">{DEFAULT_WEIGHTS.garantia}%</span>
              </li>
            </ul>

            <div className="border-t border-zinc-100 pt-3">
              <h3 className="text-xs font-semibold text-zinc-800">Faixas de Decisão da Cooperativa</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Baixo Risco: ≥ 70 pts
                </span>
                <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                  Risco Moderado: 50 a 69 pts
                </span>
                <span className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800">
                  Alto Risco: &lt; 50 pts
                </span>
              </div>
            </div>
          </section>

          {/* Fontes de dados */}
          <section className="rounded-[24px] bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-base font-semibold text-zinc-950">Fontes Oficiais e Rastreabilidade</h2>
            <ul className="divide-y divide-zinc-100">
              {SOURCES.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-3 py-2 text-xs">
                  <div>
                    <span className="font-semibold text-zinc-900">{s.name}</span>
                    <span className="block text-[11px] text-zinc-500">{s.use}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                    {s.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Governança e LGPD */}
        <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 font-semibold text-zinc-950 text-sm">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            Conformidade Regulatória e LGPD (Lei 13.709/2018 - Art. 20)
          </div>
          <p className="text-xs leading-relaxed text-zinc-600">
            O titular tem direito à revisão de decisões tomadas com base em tratamento automatizado de dados pessoais. O Campora assegura transparência total disponibilizando ao analista a decomposição exata da variação da nota (gráfico Waterfall), o resumo das 4 variáveis em linguagem simples e auditável, e as checagens com tom estritamente neutro sem decisões punitivas automáticas.
          </p>
        </div>
      </div>
    </PageSurface>
  );
}
