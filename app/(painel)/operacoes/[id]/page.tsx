import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, CloudSun, Satellite, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { PageSurface } from "@/components/shell/app-shell";
import { FarmGallery } from "@/components/farm/farm-gallery";
import {
  FarmAmount,
  FarmDescription,
  FarmHeading,
  FarmStats,
  FarmTags,
} from "@/components/farm/farm-details";
import { RiskTrendChart } from "@/components/operations/risk-trend-chart";
import { getOperationById, operations } from "@/lib/operations";

export function generateStaticParams() {
  return operations.map((op) => ({ id: op.id }));
}

export async function generateMetadata({ params }: PageProps<"/operacoes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const operation = getOperationById(id);
  return { title: operation?.farmName ?? "Operação não encontrada" };
}

const NEXT_STEPS: { icon: LucideIcon; title: string; text: string; stage: string }[] = [
  {
    icon: CloudSun,
    title: "Clima",
    text: "Chuva e temperatura comparadas com o normal do lugar (Open-Meteo e NASA POWER).",
    stage: "Etapa 2",
  },
  {
    icon: Satellite,
    title: "Pasto (NDVI)",
    text: "Vigor do pasto visto pelo satélite Sentinel-2, via Copernicus.",
    stage: "Etapa 3",
  },
  {
    icon: SlidersHorizontal,
    title: "Simulador “e se?”",
    text: "Menos chuva ou ração mais cara, e a nota muda na hora.",
    stage: "Etapa 4",
  },
];

export default async function OperacaoPage({ params }: PageProps<"/operacoes/[id]">) {
  const { id } = await params;
  const operation = getOperationById(id);
  if (!operation) notFound();

  return (
    <PageSurface>
      <Link
        href="/operacoes"
        className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Operações
      </Link>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <article className="space-y-5 rounded-[24px] bg-white p-4">
          <FarmGallery
            latitude={operation.latitude}
            longitude={operation.longitude}
            className="h-[300px]"
          />
          <div className="space-y-5 px-1">
            <FarmHeading
              operation={operation}
              size="lg"
              as="h1"
              action={
                <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 font-mono text-xs text-zinc-600">
                  {operation.id}
                </span>
              }
            />
            <FarmDescription operation={operation} />
            <FarmStats operation={operation} />
            <div className="border-t border-zinc-100 pt-5">
              <FarmTags operation={operation} />
            </div>
            <div className="border-t border-zinc-100 pt-4">
              <FarmAmount value={operation.financedAmount} />
            </div>
          </div>
        </article>

        <div className="space-y-4">
          <section className="rounded-[24px] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Evolução da nota</h2>
                <p className="text-xs text-zinc-500">0 a 100, maior significa mais risco</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Calendar className="h-3.5 w-3.5" />
                Últimos 6 meses
              </span>
            </div>
            <RiskTrendChart data={operation.monthlyHistory} />
          </section>

          <section className="rounded-[24px] bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Por que a nota mudou</h2>
            <p className="mt-1 text-sm text-zinc-500">
              A explicação em texto simples entra quando os sinais reais forem ligados.
            </p>
            <ul className="mt-4 space-y-2">
              {NEXT_STEPS.map(({ icon: Icon, title, text, stage }) => (
                <li
                  key={title}
                  className="flex items-start gap-3 rounded-2xl border border-dashed border-zinc-300 p-3"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-zinc-200 text-zinc-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900">{title}</p>
                    <p className="text-xs text-zinc-500">{text}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                    {stage}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PageSurface>
  );
}
