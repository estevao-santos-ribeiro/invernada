/**
 * Configuração central do modelo de risco da Campora
 * 
 * Regras do projeto:
 * - Faixas: >= 70 Risco Baixo (Verde), 50 a 69 Risco Moderado (Amarelo), < 50 Risco Alto (Vermelho)
 * - Pesos oficiais (UNIPLAC / Integrativa SI 2026.2):
 *   Clima: 15%, Pasto: 15%, Rebanho: 35%, Garantia: 35% (Efeito pesa mais que causa)
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
  // Faixas de risco: >=70 Baixo, 50-69 Moderado, <50 Alto
  brackets: {
    low: {
      min: 70,
      max: 100,
      label: "Risco baixo",
      level: "low",
      colorName: "green",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      bgClass: "bg-emerald-500",
      borderClass: "border-emerald-500",
      textClass: "text-emerald-700",
      hex: "#10b981",
    },
    medium: {
      min: 50,
      max: 69,
      label: "Risco moderado",
      level: "medium",
      colorName: "yellow",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      bgClass: "bg-amber-500",
      borderClass: "border-amber-500",
      textClass: "text-amber-700",
      hex: "#f59e0b",
    },
    high: {
      min: 0,
      max: 49,
      label: "Risco alto",
      level: "high",
      colorName: "red",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
      bgClass: "bg-rose-600",
      borderClass: "border-rose-600",
      textClass: "text-rose-700",
      hex: "#e11d48",
    },
  } as const,

  // Pesos do modelo da carteira pecuária (Soma = 100)
  weights: {
    clima: 15, // Causa: Geadas e chuva vs normal da estação
    pasto: 15, // Causa: Vigor do pasto / anomalia NDVI
    rebanho: 35, // Efeito: Desvio de peso do lote vs plano sazonal
    garantia: 35, // Efeito: Cobertura da garantia (lote / saldo)
  },

  trend: {
    threshold: 5,
  },
} as const;

export type RiskLevel = "low" | "medium" | "high";
