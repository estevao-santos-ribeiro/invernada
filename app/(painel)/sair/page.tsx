import type { Metadata } from "next";
import Link from "next/link";
import { LogOut, ArrowRight, ShieldCheck } from "lucide-react";
import { PageSurface } from "@/components/shell/app-shell";

export const metadata: Metadata = {
  title: "Sair · Campora",
  description: "Encerramento seguro de sessão no painel Campora.",
};

export default function SairPage() {
  return (
    <PageSurface>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-[28px] border border-zinc-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-zinc-100 text-zinc-800">
            <LogOut className="h-6 w-6" />
          </div>

          <h1 className="mt-4 text-xl font-bold tracking-tight text-zinc-950">
            Sessão Encerrada
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Você encerrou com segurança a sua sessão no painel analítico da cooperativa.
          </p>

          <div className="mt-6 rounded-2xl bg-zinc-50 p-3.5 text-xs text-zinc-600 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-left text-[11px] leading-relaxed">
              Trilhas de auditoria das consultas salvas conforme diretrizes institucionais.
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800"
            >
              Retornar ao Mapa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </PageSurface>
  );
}
