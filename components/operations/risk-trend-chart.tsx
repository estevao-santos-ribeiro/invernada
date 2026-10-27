"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { MonthlyHistory } from "@/lib/schemas/operation";
import { getRiskColorHex } from "@/lib/risk";

interface RiskTrendChartProps {
  data: MonthlyHistory[];
  isMini?: boolean;
}

export function RiskTrendChart({ data, isMini = false }: RiskTrendChartProps) {
  const currentScore = data[data.length - 1]?.score ?? 50;
  const strokeColor = getRiskColorHex(currentScore);

  if (isMini) {
    return (
      <div className="w-full h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              formatter={(value: unknown) => [`${value} pts`, "Risco"]}
              labelFormatter={(label) => `Mês: ${label}`}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "11px",
                padding: "4px 8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke={strokeColor}
              strokeWidth={2.5}
              dot={{ r: 3, fill: strokeColor }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            formatter={(value: unknown) => [`${value} / 100`, "Nota de Risco"]}
            labelFormatter={(label) => `Período: ${label}`}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            name="Nota de Risco"
            stroke={strokeColor}
            strokeWidth={3}
            dot={{ r: 4, fill: strokeColor, stroke: "#ffffff", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
