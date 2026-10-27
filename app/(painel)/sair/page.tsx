import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/shell/placeholder-screen";

export const metadata: Metadata = {
  title: "Sair",
  description: "Encerrar a sessão no painel.",
};

export default function SairPage() {
  return <PlaceholderScreen title="Sair" />;
}
