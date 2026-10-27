import { z } from "zod";

export const MonthlyHistorySchema = z.object({
  month: z.string(), // ex: "Abr/26", "Mai/26", etc.
  score: z.number().min(0).max(100),
  clima: z.number().optional(),
  pasto: z.number().optional(),
  rebanho: z.number().optional(),
  garantia: z.number().optional(),
  peso: z.number().optional(),
  pesoPlano: z.number().optional(),
  cov: z.number().optional(),
  known: z.boolean().optional(),
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
  herdType: z.string(),
  headCount: z.number().int().positive(),
  fixedRiskScore: z.number().min(0).max(100),
  monthlyHistory: z.array(MonthlyHistorySchema).min(3),
  // Campos do modelo estendido da Serra Catarinense (UNIPLAC)
  initialWeight: z.number().optional(),
  initialCoverage: z.number().optional(),
  region: z.enum(["lages", "alta"]).optional(),
  weightProfile: z.array(z.number().nullable()).optional(),
  isSimulated: z.literal(true),
  notes: z.string().optional(),
});

export const OperationsListSchema = z.array(OperationSchema);

export type MonthlyHistory = z.infer<typeof MonthlyHistorySchema>;
export type Operation = z.infer<typeof OperationSchema>;
