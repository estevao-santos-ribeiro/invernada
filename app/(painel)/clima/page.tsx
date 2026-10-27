import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/shell/placeholder-screen";

export const metadata: Metadata = {
  title: "Clima",
  description: "Clima recente comparado com o normal de cada fazenda.",
};

export default function ClimaPage() {
  return <PlaceholderScreen title="Clima" />;
}
