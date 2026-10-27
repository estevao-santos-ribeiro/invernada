import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/shell/placeholder-screen";

export const metadata: Metadata = {
  title: "Simulador",
  description: "Simule cenários como menos chuva ou ração mais cara e veja a nota mudar.",
};

export default function SimuladorPage() {
  return <PlaceholderScreen title="Simulador" />;
}
