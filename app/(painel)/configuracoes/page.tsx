import type { Metadata } from "next";
import { PageSurface } from "@/components/shell/app-shell";
import { SettingsDashboard } from "@/components/configuracoes/settings-dashboard";

export const metadata: Metadata = {
  title: "Configurações · Políticas de Crédito",
  description: "Políticas institucionais de crédito pecuário, tabelas Cepea e parâmetros do modelo.",
};

export default function ConfiguracoesPage() {
  return (
    <PageSurface>
      <SettingsDashboard />
    </PageSurface>
  );
}
