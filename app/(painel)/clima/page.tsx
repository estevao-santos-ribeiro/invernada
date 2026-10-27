import type { Metadata } from "next";
import { PageSurface } from "@/components/shell/app-shell";
import { ClimateDashboard } from "@/components/clima/climate-dashboard";

export const metadata: Metadata = {
  title: "Clima · Serra Catarinense",
  description: "Monitoramento agrometeorológico e de geadas para pecuária de corte na Serra Catarinense (Lages e região).",
};

export default function ClimaPage() {
  return (
    <PageSurface>
      <ClimateDashboard />
    </PageSurface>
  );
}
