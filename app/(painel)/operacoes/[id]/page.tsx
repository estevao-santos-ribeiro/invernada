import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageSurface } from "@/components/shell/app-shell";
import { getOperationById, operations } from "@/lib/operations";
import { OperationDetailClient } from "@/components/operations/operation-detail-client";

export function generateStaticParams() {
  return operations.map((op) => ({ id: op.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/operacoes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const operation = getOperationById(id);
  return {
    title: operation ? `${operation.farmName} · Campora` : "Operação não encontrada",
    description: operation
      ? `Indicador de risco pecuário e garantia para ${operation.farmName} (${operation.municipality})`
      : undefined,
  };
}

export default async function OperacaoPage({ params }: PageProps<"/operacoes/[id]">) {
  const { id } = await params;
  const operation = getOperationById(id);
  if (!operation) notFound();

  return (
    <PageSurface>
      <OperationDetailClient operation={operation} />
    </PageSurface>
  );
}
