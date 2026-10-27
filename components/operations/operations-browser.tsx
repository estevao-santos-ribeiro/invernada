"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search, SearchX } from "lucide-react";
import type { Operation } from "@/lib/schemas/operation";
import { applyFilters, EMPTY_FILTERS, type OperationFilters } from "@/lib/filters";
import { getRiskBracket } from "@/lib/risk";
import { formatCurrencyBRL } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { FilterBar } from "@/components/filters/filter-bar";
import { SatelliteView } from "@/components/farm/satellite-view";

function OperationRow({ operation }: { operation: Operation }) {
  const bracket = getRiskBracket(operation.fixedRiskScore);

  return (
    <li>
      <Link
        href={`/operacoes/${operation.id}`}
        className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-md"
      >
        <SatelliteView
          latitude={operation.latitude}
          longitude={operation.longitude}
          zoom={15}
          showCenter={false}
          className="h-14 w-14 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-zinc-950">{operation.farmName}</p>
          <p className="truncate text-xs text-zinc-500">
            {operation.municipality}, {operation.state} · {operation.producerName}
          </p>
        </div>
        <span className="hidden w-44 truncate text-xs text-zinc-600 md:block">{operation.herdType}</span>
        <span className="hidden w-32 text-right text-sm font-medium text-zinc-900 sm:block">
          {formatCurrencyBRL(operation.financedAmount)}
        </span>
        <span
          className={cn(
            "inline-flex w-[104px] shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
            bracket.badgeClass
          )}
          title={bracket.label}
        >
          <span className={cn("h-2 w-2 rounded-full", bracket.bgClass, bracket.level === "high" && "animate-pulse")} />
          Nota {operation.fixedRiskScore}
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </li>
  );
}

export function OperationsBrowser({ operations }: { operations: Operation[] }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<OperationFilters>(EMPTY_FILTERS);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return applyFilters(operations, filters).filter(
      (op) =>
        !term ||
        [op.farmName, op.producerName, op.municipality, op.id].some((v) => v.toLowerCase().includes(term))
    );
  }, [operations, filters, query]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block lg:w-80">
          <span className="sr-only">Buscar operação</span>
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar fazenda, produtor ou município"
            className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 shadow-md placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950"
          />
        </label>
        <FilterBar operations={operations} filters={filters} onChange={setFilters} />
      </div>

      <p className="text-xs text-zinc-500">
        {visible.length} de {operations.length} operações · ordenadas da maior para a menor nota de risco
      </p>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
          <SearchX className="mx-auto h-6 w-6 text-zinc-400" />
          <p className="mt-2 text-sm font-medium text-zinc-800">Nenhuma operação encontrada</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((op) => (
            <OperationRow key={op.id} operation={op} />
          ))}
        </ul>
      )}
    </section>
  );
}
