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
 * Retorna todas as operações ordenadas por maior risco primeiro (menor nota de risco)
 */
export function getOperationsSortedByRisk(): Operation[] {
  return [...operations].sort((a, b) => a.fixedRiskScore - b.fixedRiskScore);
}

/**
 * Retorna uma versão da operação com a nota ajustada para o mês selecionado (0 = Abr, 2 = Jun, etc.)
 */
export function getOperationAtMonth(op: Operation, monthIndex: number): Operation {
  const row = op.monthlyHistory[monthIndex];
  if (!row) return op;
  return {
    ...op,
    fixedRiskScore: row.score,
  };
}

/**
 * Retorna as operações ajustadas e ordenadas pelo risco do mês selecionado
 */
export function getOperationsAtMonth(ops: Operation[], monthIndex: number): Operation[] {
  return ops
    .map((op) => getOperationAtMonth(op, monthIndex))
    .sort((a, b) => a.fixedRiskScore - b.fixedRiskScore);
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
