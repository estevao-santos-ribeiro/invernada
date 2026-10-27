import type { Metadata } from "next";
import { PageSurface } from "@/components/shell/app-shell";
import { RiskSimulator } from "@/components/simulador/risk-simulator";

export const metadata: Metadata = {
  title: "Simulador · Cenários “E se?”",
  description: "Simulador de estresse e calibração de pesos para o indicador de risco pecuário.",
};

export default function SimuladorPage() {
  return (
    <PageSurface>
      <RiskSimulator />
    </PageSurface>
  );
}
