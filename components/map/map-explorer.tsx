"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import { SearchX } from "lucide-react";
import { DEFAULT_MAP_LAYER, MAP_LAYERS, type MapLayerId } from "@/config/map-config";
import { RISK_CONFIG } from "@/config/risk-config";
import type { Operation } from "@/lib/schemas/operation";
import { applyFilters, EMPTY_FILTERS, type OperationFilters } from "@/lib/filters";
import { cn } from "@/lib/utils";
import { FilterBar } from "@/components/filters/filter-bar";
import { FarmCard } from "@/components/farm/farm-card";

// Leaflet usa window: carregado só no cliente.
const RiskMap = dynamic(() => import("./risk-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full animate-pulse place-items-center bg-zinc-300 text-sm text-zinc-600">
      Carregando mapa…
    </div>
  ),
});

function LayerToggle({ value, onChange }: { value: MapLayerId; onChange: (v: MapLayerId) => void }) {
  return (
    <div role="radiogroup" aria-label="Camada do mapa" className="ml-auto flex shrink-0 rounded-full bg-white p-1 shadow-md">
      {Object.values(MAP_LAYERS).map((layer) => (
        <button
          key={layer.id}
          type="button"
          role="radio"
          aria-checked={value === layer.id}
          onClick={() => onChange(layer.id)}
          className={cn(
            "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors",
            value === layer.id ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-100"
          )}
        >
          {layer.label}
        </button>
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div className="absolute left-2 top-14 z-10 flex items-center gap-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-zinc-700 shadow-md backdrop-blur-sm lg:bottom-4 lg:left-[396px] lg:top-auto">
      {(["low", "medium", "high"] as const).map((level) => {
        const b = RISK_CONFIG.brackets[level];
        return (
          <span key={level} className="flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-full", b.bgClass, level === "high" && "animate-pulse")} />
            {b.min}–{b.max}
          </span>
        );
      })}
    </div>
  );
}

export function MapExplorer({ operations }: { operations: Operation[] }) {
  const [filters, setFilters] = useState<OperationFilters>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | undefined>(operations[0]?.id);
  const [layer, setLayer] = useState<MapLayerId>(DEFAULT_MAP_LAYER);
  const [focusRequest, setFocusRequest] = useState(0);

  const visible = useMemo(() => applyFilters(operations, filters), [operations, filters]);
  // Se a selecionada saiu do filtro, mostra a de maior risco restante.
  const selected = visible.find((op) => op.id === selectedId) ?? visible[0];

  const select = (op: Operation) => {
    setSelectedId(op.id);
    setFocusRequest((n) => n + 1);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-zinc-300">
      <RiskMap
        operations={visible}
        selectedId={selected?.id}
        layer={layer}
        focusRequest={focusRequest}
        onSelect={select}
      />

      <FilterBar
        operations={operations}
        filters={filters}
        onChange={setFilters}
        className="absolute inset-x-2 top-2 z-10 lg:left-[396px] lg:right-3 lg:top-3"
      >
        <LayerToggle value={layer} onChange={setLayer} />
      </FilterBar>

      <Legend />

      <AnimatePresence mode="wait">
        {selected ? (
          <FarmCard key={selected.id} operation={selected} onFocus={() => select(selected)} />
        ) : (
          <div className="absolute inset-x-2 bottom-2 z-10 rounded-[22px] bg-white p-6 text-center shadow-xl lg:inset-x-auto lg:left-3 lg:top-3 lg:bottom-auto lg:w-[372px]">
            <SearchX className="mx-auto h-6 w-6 text-zinc-400" />
            <p className="mt-2 text-sm font-medium text-zinc-800">Nenhuma operação com esses filtros</p>
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="mt-3 cursor-pointer rounded-full bg-zinc-950 px-4 py-2 text-xs font-medium text-white"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
