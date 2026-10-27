/**
 * Configuração central do modelo de risco da Campora
 * 
 * Regra do projeto: Os pesos e faixas de risco ficam centralizados
 * neste único arquivo para facilitar calibragem pela cooperativa.
 */

export interface RiskBrackets {
  low: {
    min: number;
    max: number;
    label: string;
    level: "low";
    colorName: "green";
    badgeClass: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    hex: string;
  };
  medium: {
    min: number;
    max: number;
    label: string;
    level: "medium";
    colorName: "yellow";
    badgeClass: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    hex: string;
  };
  high: {
    min: number;
    max: number;
    label: string;
    level: "high";
    colorName: "red";
    badgeClass: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    hex: string;
  };
}

export const RISK_CONFIG = {
  // Faixas de risco (0 a 100, maior = mais risco)
  brackets: {
    low: {
      min: 0,
      max: 33,
      label: "Baixo Risco",
      level: "low",
      colorName: "green",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      bgClass: "bg-emerald-500",
      borderClass: "border-emerald-500",
      textClass: "text-emerald-700",
      hex: "#10b981",
    },
    medium: {
      min: 34,
      max: 66,
      label: "Risco Moderado",
      level: "medium",
      colorName: "yellow",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      bgClass: "bg-amber-500",
      borderClass: "border-amber-500",
      textClass: "text-amber-700",
      hex: "#f59e0b",
    },
    high: {
      min: 67,
      max: 100,
      label: "Alto Risco",
      level: "high",
      colorName: "red",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
      bgClass: "bg-rose-600",
      borderClass: "border-rose-600",
      textClass: "text-rose-700",
      hex: "#e11d48",
    },
  } as const,

  // Pesos dos 3 pilares para as etapas 2, 3 e 4 (Soma = 1.0)
  weights: {
    climate: 0.4, // Clima (chuva e temperatura vs histórico)
    pasture: 0.35, // Pastagem (NDVI via satélite Sentinel-2)
    costs: 0.25, // Custo de alimentação / insumos
  },

  // Variação mínima (em pontos, nos últimos 6 meses) para considerar risco em alta ou em queda
  trend: {
    threshold: 5,
  },
} as const;

export type RiskLevel = "low" | "medium" | "high";
