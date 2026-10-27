import type { Metadata } from "next";
import { PageSurface } from "@/components/shell/app-shell";
import { RISK_CONFIG } from "@/config/risk-config";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Como o Campora calcula a nota de risco e de onde vêm os dados.",
};

const SOURCES = [
  { name: "Esri World Imagery", use: "Mapa e recortes de satélite", status: "Em uso" },
  { name: "OpenStreetMap", use: "Mapa de ruas alternativo", status: "Em uso" },
  { name: "Open-Meteo", use: "Clima recente por coordenada", status: "Etapa 2" },
  { name: "NASA POWER", use: "Normal climatológico do lugar", status: "Etapa 2" },
  { name: "Copernicus / Sentinel-2", use: "NDVI e imagem datada da fazenda", status: "Etapa 3" },
];

export default function SobrePage() {
  const { weights, brackets } = RISK_CONFIG;

  return (
    <PageSurface>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Sobre o Campora</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-600">
        Painel acadêmico para acompanhar o risco de financiamentos de pecuária. O diferencial é explicar
        o motivo da nota em linguagem simples e simular cenários. As operações são simuladas; a nota é
        ilustrativa.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-[24px] bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Como a nota funciona</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700">
            <li>Clima: peso {Math.round(weights.climate * 100)}%</li>
            <li>Pasto (NDVI): peso {Math.round(weights.pasture * 100)}%</li>
            <li>Custos de alimentação: peso {Math.round(weights.costs * 100)}%</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.values(brackets).map((b) => (
              <span key={b.level} className={`rounded-full border px-3 py-1 text-xs font-medium ${b.badgeClass}`}>
                {b.label}: {b.min} a {b.max}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Fontes de dados</h2>
          <ul className="mt-3 divide-y divide-zinc-100">
            {SOURCES.map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span>
                  <span className="font-medium text-zinc-900">{s.name}</span>
                  <span className="block text-xs text-zinc-500">{s.use}</span>
                </span>
                <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageSurface>
  );
}
