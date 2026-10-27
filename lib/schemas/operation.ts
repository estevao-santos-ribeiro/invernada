import { z } from "zod";

export const MonthlyHistorySchema = z.object({
  month: z.string(), // ex: "Mai/26", "Jun/26", etc.
  score: z.number().min(0).max(100),
});

export const OperationSchema = z.object({
  id: z.string(),
  producerName: z.string().min(2),
  farmName: z.string().min(2),
  municipality: z.string().min(2),
  state: z.string().length(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  financedAmount: z.number().positive(),
  herdType: z.enum(["Corte - Cria", "Corte - Recria/Engorda", "Corte - Ciclo Completo", "Leiteiro"]),
  headCount: z.number().int().positive(),
  fixedRiskScore: z.number().min(0).max(100),
  monthlyHistory: z.array(MonthlyHistorySchema).min(3),
  // Metadados explícitos garantindo clareza de simulação (Regra 1)
  isSimulated: z.literal(true),
  notes: z.string().optional(),
});

export const OperationsListSchema = z.array(OperationSchema);

export type MonthlyHistory = z.infer<typeof MonthlyHistorySchema>;
export type Operation = z.infer<typeof OperationSchema>;
