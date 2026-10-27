import rawOperations from "@/data/operations.json";
import { OperationsListSchema, type Operation } from "@/lib/schemas/operation";
import { getRiskLevel } from "@/lib/risk";
import type { RiskLevel } from "@/config/risk-config";

// Valida os dados simulados com Zod no momento de inicialização
const parsed = OperationsListSchema.safeParse(rawOperations);

if (!parsed.success) {
  console.error("Erro na validação do schema de operações:", parsed.error);
  throw new Error("Dados de operações em data/operations.json inválidos!");
}

export const operations: Operation[] = parsed.data;

/**
 * Retorna todas as operações ordenadas por nota de risco decrescente (maior risco primeiro)
 */
export function getOperationsSortedByRisk(): Operation[] {
  return [...operations].sort((a, b) => b.fixedRiskScore - a.fixedRiskScore);
}

/**
 * Busca uma operação específica pelo ID
 */
export function getOperationById(id: string): Operation | undefined {
  return operations.find((op) => op.id === id);
}

/**
 * Resumo geral das operações
 */
export function getOperationsSummary() {
  const total = operations.length;
  const countLevel = (level: RiskLevel) =>
    operations.filter((op) => getRiskLevel(op.fixedRiskScore) === level).length;
  const totalFinanced = operations.reduce((acc, curr) => acc + curr.financedAmount, 0);

  return {
    total,
    highRiskCount: countLevel("high"),
    mediumRiskCount: countLevel("medium"),
    lowRiskCount: countLevel("low"),
    totalFinanced,
  };
}
