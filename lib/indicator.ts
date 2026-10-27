/**
 * Modelo de Indicador de Risco Pecuário — UNIPLAC / Integrativa SI 2026.2 (Desafio 1)
 * 
 * Quatro variáveis com pesos calibráveis:
 * 1. Clima (15%): Geadas e chuva vs normal histórica da estação (Open-Meteo / INMET)
 * 2. Pastagem (15%): Vigor do pasto / anomalia de NDVI (SATVeg / Embrapa)
 * 3. Rebanho (35%): Desvio do ganho de peso em kg/cab vs plano sazonal (pesagem informada)
 * 4. Garantia (35%): Índice de cobertura = (rebanho * peso * R$/kg) / saldo devedor
 * 
 * Faixas: >= 70 Risco Baixo (Verde), 50 a 69 Risco Moderado (Amarelo), < 50 Risco Alto (Vermelho)
 */

export const MONTHS = ["Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out"] as const;
export const MONTHS_FULL = [
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
] as const;

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Ganho planejado por cabeça no mês (kg): plano sazonal da estação
export const PLAN = [0, 6, 0, 0, 6, 15, 24];

// Preço do boi gordo R$/kg vivo (tabela mensal Cepea / Epagri-Cepa 2026)
export const PRICE = [13.10, 13.25, 13.05, 13.20, 13.40, 13.55, 13.70];

// Juros de custeio pecuário ao mês sobre o saldo
export const INTEREST_RATE = 0.009;

// Cobertura mínima da política de crédito da cooperativa
export const MIN_COVERAGE = 1.3;

// Nota neutra de rebanho quando falta pesagem recente
export const NEUTRAL_HERD_SCORE = 50;

export const REGIONS = {
  lages: {
    nome: "Lages e entorno",
    geadas: [0, 5, 8, 3, 2, 1, 0],
    geadasNormal: [0, 2, 5, 6, 4, 1, 0],
    chuva: [95, 80, 90, 125, 160, 120, 130], // % da média histórica
    pastoAnom: [0, -10, -25, -20, -12, -7, 0], // anomalia NDVI %
  },
  alta: {
    nome: "Serra Alta (Urupema/Painel)",
    geadas: [0, 8, 12, 6, 4, 3, 0],
    geadasNormal: [0, 4, 8, 9, 6, 3, 1],
    chuva: [92, 78, 88, 122, 155, 118, 128],
    pastoAnom: [-2, -17, -33, -27, -17, -12, -2],
  },
};

export const HISTORICAL_EVENTS: Record<number, string> = {
  1: "Geadas cedo (21/5)",
  2: "Geada forte (24/6, -9,1°C)",
  4: "Chuva intensa (28 a 31/8)",
  5: "Geada isolada (17/9)",
};

export const DEFAULT_WEIGHTS = {
  clima: 15,
  pasto: 15,
  rebanho: 35,
  garantia: 35,
};

export type Weights = typeof DEFAULT_WEIGHTS;
export type IndicatorKey = keyof Weights;

export const INDICATOR_LABELS: Record<IndicatorKey, string> = {
  clima: "Clima",
  pasto: "Pastagem",
  rebanho: "Rebanho",
  garantia: "Garantia",
};

export const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export const F = {
  // Clima (0 a 100): 80 - 10*(geadas acima do normal) - 0.5*(déficit chuva <85%) - 0.3*(excesso chuva >150%)
  clima: (geadas: number, geadasNormal: number, chuvaPercent: number) =>
    clamp(
      80 -
        10 * Math.max(0, geadas - geadasNormal) -
        0.5 * Math.max(0, 85 - chuvaPercent) -
        0.3 * Math.max(0, chuvaPercent - 150)
    ),

  // Pastagem NDVI (0 a 100): 85 + 1.2 * anomalia NDVI %
  pasto: (anomaliaPercent: number) => clamp(85 + 1.2 * anomaliaPercent),

  // Rebanho (0 a 100): 85 + 2.5 * desvio kg/cab vs plano sazonal
  rebanho: (desvioKg: number) => clamp(85 + 2.5 * desvioKg),

  // Garantia (0 a 100): <= 1.0x = 0; 1.0 a 1.3x vai de 0 a 50; 1.3 a 1.8x vai de 50 a 100
  garantia: (cobertura: number) => {
    if (cobertura <= 1) return 0;
    if (cobertura <= MIN_COVERAGE) {
      return ((cobertura - 1) / (MIN_COVERAGE - 1)) * 50;
    }
    return clamp(50 + ((cobertura - MIN_COVERAGE) / 0.5) * 50);
  },
};

export interface MonthDataRow {
  m: number;
  monthName: string;
  peso: number;
  pesoPlano: number;
  dev: number;
  cov: number;
  saldo: number;
  known: boolean;
  lastData: number;
  sub: {
    clima: number;
    pasto: number;
    rebanho: number;
    garantia: number;
  };
  score: number;
}

export interface OperationBaseData {
  id: string;
  farmName: string;
  producerName: string;
  municipality: string;
  state: string;
  latitude: number;
  longitude: number;
  financedAmount: number;
  herdType: string;
  headCount: number;
  initialWeight: number; // w0
  initialCoverage: number; // cov0
  region: "lages" | "alta";
  weightProfile: (number | null)[];
  notes?: string;
}

/**
 * Calcula a série mensal completa de Abril a Outubro de 2026 para uma operação
 */
export function computeOperationMonths(
  op: OperationBaseData,
  weights: Weights = DEFAULT_WEIGHTS,
  registeredWeights: Record<number, number> = {}
): MonthDataRow[] {
  const reg = REGIONS[op.region] || REGIONS.lages;
  const saldo0 = (op.headCount * op.initialWeight * PRICE[0]) / op.initialCoverage;
  const rows: MonthDataRow[] = [];

  let w = op.initialWeight;
  let wPlan = op.initialWeight;
  let lastData = 0;
  let known = true;

  const totalWeights =
    weights.clima + weights.pasto + weights.rebanho + weights.garantia || 1;

  for (let m = 0; m < 7; m++) {
    wPlan += PLAN[m];

    if (registeredWeights[m] != null) {
      w = registeredWeights[m];
      known = true;
      lastData = m;
    } else if (op.weightProfile[m] !== null) {
      w += (op.weightProfile[m] as number);
      known = true;
      lastData = m;
    } else {
      w += PLAN[m];
      known = false;
    }

    const saldo = saldo0 * Math.pow(1 + INTEREST_RATE, m);
    const cov = (op.headCount * w * PRICE[m]) / saldo;
    const dev = w - wPlan;

    const sub = {
      clima: F.clima(reg.geadas[m], reg.geadasNormal[m], reg.chuva[m]),
      pasto: F.pasto(reg.pastoAnom[m]),
      rebanho: known ? F.rebanho(dev) : NEUTRAL_HERD_SCORE,
      garantia: F.garantia(cov),
    };

    const sc =
      (weights.clima * sub.clima +
        weights.pasto * sub.pasto +
        weights.rebanho * sub.rebanho +
        weights.garantia * sub.garantia) /
      totalWeights;

    rows.push({
      m,
      monthName: MONTHS[m],
      peso: Math.round(w * 10) / 10,
      pesoPlano: Math.round(wPlan * 10) / 10,
      dev: Math.round(dev * 10) / 10,
      cov: Math.round(cov * 100) / 100,
      saldo: Math.round(saldo),
      known,
      lastData,
      sub: {
        clima: Math.round(sub.clima),
        pasto: Math.round(sub.pasto),
        rebanho: Math.round(sub.rebanho),
        garantia: Math.round(sub.garantia),
      },
      score: Math.round(sc),
    });
  }

  return rows;
}

/**
 * Decompõe a variação da nota da contratação (Abril) até o mês selecionado
 */
export function decomposeScore(
  rows: MonthDataRow[],
  monthIndex: number,
  weights: Weights = DEFAULT_WEIGHTS
) {
  const r0 = rows[0];
  const r = rows[monthIndex];
  const totalW =
    weights.clima + weights.pasto + weights.rebanho + weights.garantia || 1;

  const keys: IndicatorKey[] = ["clima", "pasto", "rebanho", "garantia"];

  const parts = keys.map((k) => {
    const diff = r.sub[k] - r0.sub[k];
    const contribution = (weights[k] / totalW) * diff;
    return {
      k,
      label: INDICATOR_LABELS[k],
      v: Math.round(contribution * 10) / 10,
      subCurrent: r.sub[k],
      subInitial: r0.sub[k],
      missing: k === "rebanho" && !r.known,
    };
  });

  return {
    s0: r0.score,
    s: r.score,
    delta: r.score - r0.score,
    parts,
  };
}

/**
 * Gera as explicações das 4 variáveis para o mês em linguagem simples
 */
export function getReasons(
  op: OperationBaseData,
  rows: MonthDataRow[],
  monthIndex: number
) {
  const reg = REGIONS[op.region] || REGIONS.lages;
  const r = rows[monthIndex];
  const a = reg.pastoAnom[monthIndex];
  const d = Math.round(r.dev);

  return [
    {
      k: "clima" as IndicatorKey,
      label: "Clima",
      text: `${reg.geadas[monthIndex]} geadas em ${MONTHS_FULL[monthIndex]} (normal da região: ${reg.geadasNormal[monthIndex]}); chuva a ${reg.chuva[monthIndex]}% da média histórica.`,
    },
    {
      k: "pasto" as IndicatorKey,
      label: "Pastagem",
      text:
        a === 0
          ? `Pasto dentro do normal de ${MONTHS_FULL[monthIndex]} (NDVI).`
          : `Pasto ${Math.abs(a)}% ${a < 0 ? "abaixo" : "acima"} do normal de ${MONTHS_FULL[monthIndex]} (NDVI).`,
    },
    {
      k: "rebanho" as IndicatorKey,
      label: "Rebanho",
      text: !r.known
        ? `Sem pesagem desde ${MONTHS_FULL[r.lastData]}. Entra com valor neutro (50) até chegar dado novo.`
        : d === 0
        ? "Peso do lote igual ao plano sazonal."
        : `Lote com ${Math.abs(d)} kg/cabeça ${d < 0 ? "abaixo" : "acima"} do plano sazonal (${r.peso} kg contra ${r.pesoPlano} kg previsto).`,
    },
    {
      k: "garantia" as IndicatorKey,
      label: "Garantia",
      text: `Lote vale ${r.cov}x o saldo devedor${r.known ? "" : " (estimado pelo plano)"}; mínimo da política: ${MIN_COVERAGE.toFixed(1)}x.`,
    },
  ];
}

/**
 * Gera pontos de atenção em tom estritamente neutro
 */
export function getChecks(
  op: OperationBaseData,
  rows: MonthDataRow[],
  monthIndex: number
): string[] {
  const r = rows[monthIndex];
  const reg = REGIONS[op.region] || REGIONS.lages;
  const out: string[] = [];

  let belowCount = 0;
  for (let i = monthIndex; i >= 1 && rows[i].known && rows[i].dev < -8; i--) {
    belowCount++;
  }

  if (belowCount > 0) {
    out.push(
      `O ganho de peso está abaixo do plano sazonal há ${belowCount} ${
        belowCount > 1 ? "meses" : "mês"
      }. Pode ser útil confirmar se houve suplementação no período.`
    );
  }

  if (!r.known) {
    const elapsed = monthIndex - r.lastData;
    out.push(
      `Não há pesagem desde ${MONTHS_FULL[r.lastData]} (${elapsed} ${
        elapsed > 1 ? "meses" : "mês"
      }). O valor da garantia está estimado pelo plano. Pode ser útil solicitar a atualização do inventário.`
    );
  }

  if (r.cov < MIN_COVERAGE) {
    out.push(
      `A garantia está em ${r.cov}x, abaixo do mínimo de ${MIN_COVERAGE.toFixed(
        1
      )}x da política. Pode ser útil conferir o número de animais e o peso na próxima atualização.`
    );
  }

  if (reg.geadas[monthIndex] > reg.geadasNormal[monthIndex] + 1) {
    out.push(
      `Mês com geadas acima do normal na região (${reg.nome}). Outras operações próximas podem ter sido afetadas.`
    );
  }

  if (reg.pastoAnom[monthIndex] <= -20) {
    out.push(
      "Pasto bem abaixo do normal da época (NDVI). Pode ser útil verificar se há reserva de alimento para o lote."
    );
  }

  return out;
}

/**
 * Estrutura a resposta da API simulada GET /v1/operacoes/{id}/score?mes=2026-XX
 */
export function getMockApiResponse(
  op: OperationBaseData,
  rows: MonthDataRow[],
  monthIndex: number,
  weights: Weights = DEFAULT_WEIGHTS
) {
  const r = rows[monthIndex];
  const decomp = decomposeScore(rows, monthIndex, weights);

  const levelText =
    r.score >= 70 ? "baixo" : r.score >= 50 ? "moderado" : "alto";

  const ym = `2026-${String(monthIndex + 4).padStart(2, "0")}`;

  return {
    operacao: op.id,
    fazenda: op.farmName,
    municipio: op.municipality,
    mes: ym,
    score: r.score,
    faixa: levelText,
    score_contratacao: decomp.s0,
    confianca: r.known ? "normal" : "baixa",
    notas: {
      clima: r.sub.clima,
      pastagem: r.sub.pasto,
      rebanho: r.sub.rebanho,
      garantia: r.sub.garantia,
    },
    pesos: weights,
    contribuicoes: Object.fromEntries(decomp.parts.map((p) => [p.k, p.v])),
    motivos: getReasons(op, rows, monthIndex).map((x) => x.text),
    pontos_para_verificar: getChecks(op, rows, monthIndex),
  };
}
