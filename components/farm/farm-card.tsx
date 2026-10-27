"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BarChart3, ChevronDown, Crosshair } from "lucide-react";
import type { Operation } from "@/lib/schemas/operation";
import { cn } from "@/lib/utils";
import { RiskTrendChart } from "@/components/operations/risk-trend-chart";
import { FarmGallery } from "./farm-gallery";
import {
  FarmAmount,
  FarmDescription,
  FarmHeading,
  FarmStats,
  FarmTags,
} from "./farm-details";

interface FarmCardProps {
  operation: Operation;
  onFocus: () => void;
}

/** Cartão branco flutuante sobre o mapa (painel inferior recolhível no celular). */
export function FarmCard({ operation, onFocus }: FarmCardProps) {
  const [expanded, setExpanded] = useState(false);
  const extra = expanded ? "block" : "hidden lg:block";

  return (
    <motion.section
      key={operation.id}
      aria-label={`Operação ${operation.farmName}`}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="absolute inset-x-2 bottom-2 z-10 flex max-h-[72%] flex-col overflow-hidden rounded-[22px] bg-white shadow-xl lg:inset-x-auto lg:bottom-3 lg:left-3 lg:top-3 lg:max-h-none lg:w-[372px]"
    >
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 pb-4">
        <div className={extra}>
          <FarmGallery latitude={operation.latitude} longitude={operation.longitude} />
        </div>

        <div className="space-y-4 px-1">
          <FarmHeading
            operation={operation}
            action={
              <button
                type="button"
                onClick={onFocus}
                aria-label="Centralizar no mapa"
                title="Centralizar no mapa"
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-zinc-200 text-zinc-800 transition-colors hover:bg-zinc-100"
              >
                <Crosshair className="h-4 w-4" />
              </button>
            }
          />

          <div className={extra}>
            <FarmDescription operation={operation} />
          </div>

          <FarmStats operation={operation} />

          <div className={cn("rounded-2xl border border-zinc-200 p-3", extra)}>
            <p className="mb-1 text-xs font-medium text-zinc-500">Nota nos últimos 6 meses</p>
            <RiskTrendChart data={operation.monthlyHistory} isMini />
          </div>

          <div className={cn("border-t border-zinc-100 pt-4", extra)}>
            <FarmTags operation={operation} />
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex w-full cursor-pointer items-center justify-center gap-1 text-xs font-medium text-zinc-500 lg:hidden"
          >
            {expanded ? "Menos informações" : "Mais informações"}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3">
        <FarmAmount value={operation.financedAmount} />
        <Link
          href={`/operacoes/${operation.id}`}
          className="inline-flex items-center gap-3 rounded-full bg-zinc-950 py-1.5 pl-5 pr-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Ver detalhes
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-zinc-950">
            <BarChart3 className="h-4 w-4" />
          </span>
        </Link>
      </footer>
    </motion.section>
  );
}
