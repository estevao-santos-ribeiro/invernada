"use client";

import { useMemo } from "react";
import type { MonthDataRow } from "@/lib/indicator";
import { decomposeScore } from "@/lib/indicator";
import { cn } from "@/lib/utils";

interface WaterfallChartProps {
  rows: MonthDataRow[];
  selectedMonth: number;
}

export function WaterfallChart({ rows, selectedMonth }: WaterfallChartProps) {
  const decomp = useMemo(() => {
    return decomposeScore(rows, selectedMonth);
  }, [rows, selectedMonth]);

  const { s0, s, delta, parts } = decomp;

  // Monta as barras: Inicial, Clima, Pasto, Rebanho, Garantia, Final
  type Step = {
    label: string;
    sublabel?: string;
    val: number;
    start: number;
    end: number;
    type: "total" | "pos" | "neg" | "neutral";
    missing?: boolean;
  };

  const steps: Step[] = [];
  steps.push({
    label: "Contratação",
    sublabel: "Abril",
    val: s0,
    start: 0,
    end: s0,
    type: "total",
  });

  let running = s0;
  for (const p of parts) {
    const start = running;
    const end = Math.max(0, Math.min(100, running + p.v));
    running = end;
    steps.push({
      label: p.label,
      val: p.v,
      start: Math.min(start, end),
      end: Math.max(start, end),
      type: p.v > 0 ? "pos" : p.v < 0 ? "neg" : "neutral",
      missing: p.missing,
    });
  }

  steps.push({
    label: "Score Atual",
    sublabel: rows[selectedMonth]?.monthName,
    val: s,
    start: 0,
    end: s,
    type: "total",
  });

  // Dimensões SVG
  const width = 640;
  const height = 220;
  const padX = 24;
  const padY = 32;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const barW = Math.min(60, (chartW / steps.length) * 0.7);
  const stepGap = chartW / steps.length;

  const yScale = (val: number) => chartH - (val / 100) * chartH + padY;

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-medium text-zinc-600">
          Decomposição da variação:{" "}
          <strong
            className={cn(
              delta > 0
                ? "text-emerald-700"
                : delta < 0
                ? "text-rose-700"
                : "text-zinc-700"
            )}
          >
            {delta > 0 ? `+${delta}` : delta} pts
          </strong>{" "}
          desde a contratação (Abril)
        </span>
        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Contribuição positiva
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Contribuição negativa
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-zinc-800" />
            Score acumulado
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-zinc-50/70 p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full min-w-[540px]"
          aria-label="Gráfico cascata de decomposição do risco"
        >
          {/* Linhas de grade de 0 a 100 */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = yScale(tick);
            return (
              <g key={tick}>
                <line
                  x1={padX}
                  y1={y}
                  x2={width - padX}
                  y2={y}
                  stroke="#e4e4e7"
                  strokeDasharray={tick === 50 || tick === 70 ? "4 4" : undefined}
                  strokeWidth="1"
                />
                <text
                  x={padX - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-zinc-400 text-[10px]"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Barras do Waterfall */}
          {steps.map((st, i) => {
            const cx = padX + i * stepGap + stepGap / 2;
            const x = cx - barW / 2;
            const yTop = yScale(st.end);
            const yBot = yScale(st.start);
            const barH = Math.max(3, Math.abs(yBot - yTop));
            const y = Math.min(yTop, yBot);

            const color =
              st.type === "total"
                ? "#27272a"
                : st.type === "pos"
                ? "#10b981"
                : st.type === "neg"
                ? "#f43f5e"
                : "#a1a1aa";

            const valText =
              st.type === "total"
                ? `${Math.round(st.val)}`
                : st.val > 0
                ? `+${st.val}`
                : `${st.val}`;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  rx="4"
                  fill={color}
                  opacity={st.missing ? 0.45 : 0.9}
                />
                <text
                  x={cx}
                  y={y - 5}
                  textAnchor="middle"
                  className="fill-zinc-900 text-[11px] font-semibold"
                >
                  {valText}
                </text>
                <text
                  x={cx}
                  y={height - padY + 16}
                  textAnchor="middle"
                  className="fill-zinc-700 text-[10px] font-medium"
                >
                  {st.label}
                </text>
                {st.sublabel && (
                  <text
                    x={cx}
                    y={height - padY + 28}
                    textAnchor="middle"
                    className="fill-zinc-400 text-[9px]"
                  >
                    {st.sublabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
