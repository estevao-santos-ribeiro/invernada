"use client";

import { useState } from "react";
import {
  Scale,
  TrendingUp,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Save,
} from "lucide-react";
import {
  MIN_COVERAGE,
  INTEREST_RATE,
  PLAN,
  PRICE,
  MONTHS,
  DEFAULT_WEIGHTS,
} from "@/lib/indicator";

export function SettingsDashboard() {
  const [minCoverage, setMinCoverage] = useState(MIN_COVERAGE);
  const [interestRate, setInterestRate] = useState(INTEREST_RATE * 100);
  const [savedNotice, setSavedNotice] = useState(false);
  const [importedNotice, setImportedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleMockImport = () => {
    setImportedNotice(true);
    setTimeout(() => setImportedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            Políticas de Crédito e Parâmetros
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Regras de crédito da cooperativa, tabelas de referência Cepea e plano sazonal de recria
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Parâmetros atualizados com sucesso!
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Parâmetros da Política de Crédito */}
        <section className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-zinc-700" />
            <h2 className="text-base font-semibold text-zinc-950">
              Regras Institucionais da Cooperativa
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-800">
                Índice de Cobertura Mínimo da Garantia (x saldo devedor)
              </label>
              <p className="mt-0.5 text-zinc-500">
                Abaixo deste valor a garantia gera alerta de atenção e subnota menor.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  min="1.0"
                  max="2.5"
                  value={minCoverage}
                  onChange={(e) => setMinCoverage(parseFloat(e.target.value))}
                  className="w-32 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
                <span className="font-medium text-zinc-600">x o valor da dívida</span>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-4">
              <label className="block font-semibold text-zinc-800">
                Taxa de Juros do Custeio Pecuário (% ao mês sobre saldo devedor)
              </label>
              <p className="mt-0.5 text-zinc-500">
                Utilizado para projeção do saldo devedor corrigido ao longo da safra.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="3.0"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-32 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
                <span className="font-medium text-zinc-600">% a.m. (aprox. 11,3% a.a.)</span>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-4">
              <label className="block font-semibold text-zinc-800">
                Pesos Padrão do Indicador (Calibração Oficial)
              </label>
              <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                <div className="rounded-xl bg-zinc-50 p-2 border border-zinc-200">
                  <span className="block text-[10px] text-zinc-500">Clima</span>
                  <strong className="text-sm text-zinc-950">{DEFAULT_WEIGHTS.clima}%</strong>
                </div>
                <div className="rounded-xl bg-zinc-50 p-2 border border-zinc-200">
                  <span className="block text-[10px] text-zinc-500">Pastagem</span>
                  <strong className="text-sm text-zinc-950">{DEFAULT_WEIGHTS.pasto}%</strong>
                </div>
                <div className="rounded-xl bg-zinc-50 p-2 border border-zinc-200">
                  <span className="block text-[10px] text-zinc-500">Rebanho</span>
                  <strong className="text-sm text-zinc-950">{DEFAULT_WEIGHTS.rebanho}%</strong>
                </div>
                <div className="rounded-xl bg-zinc-50 p-2 border border-zinc-200">
                  <span className="block text-[10px] text-zinc-500">Garantia</span>
                  <strong className="text-sm text-zinc-950">{DEFAULT_WEIGHTS.garantia}%</strong>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-zinc-950 px-5 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
              >
                <Save className="h-3.5 w-3.5" />
                Salvar Parâmetros Institucionais
              </button>
            </div>
          </form>
        </section>

        {/* Tabela de Preço do Boi e Plano Sazonal */}
        <section className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-zinc-700" />
            <h2 className="text-base font-semibold text-zinc-950">
              Tabela de Mercado e Plano Sazonal (2026)
            </h2>
          </div>
          <p className="text-xs text-zinc-500">
            Valores de referência Cepea / Epagri-Cepa e curva típica de ganho de peso a pasto
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400">
                  <th className="pb-2 font-medium">Mês</th>
                  <th className="pb-2 font-medium">Ganho Previsto</th>
                  <th className="pb-2 font-medium">Preço Boi Gordo</th>
                  <th className="pb-2 font-medium">Estágio Sazonal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {MONTHS.map((m, idx) => (
                  <tr key={m}>
                    <td className="py-2.5 font-semibold text-zinc-900">{m}/2026</td>
                    <td className="py-2.5 font-mono">
                      {PLAN[idx] > 0 ? `+${PLAN[idx]} kg/cab` : `${PLAN[idx]} kg (inverno)`}
                    </td>
                    <td className="py-2.5 font-mono font-semibold text-zinc-900">
                      R$ {PRICE[idx].toFixed(2)}/kg vivo
                    </td>
                    <td className="py-2.5 text-zinc-500">
                      {idx <= 1
                        ? "Outono / transição"
                        : idx <= 3
                        ? "Pico de geadas (estagnação normal)"
                        : idx === 4
                        ? "Fim do inverno"
                        : "Primavera / rebrota vigorosa"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Importação e Sincronização de Dados (CSV) */}
      <section className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-zinc-950">
              Sincronização da Carteira de Crédito
            </h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
            16 operações ativas
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          Faça upload de planilhas de inventário de gado ou pesagens atualizadas enviadas pelos cooperados
        </p>

        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/70 p-6 text-center hover:bg-zinc-50">
          <Upload className="h-8 w-8 text-zinc-400" />
          <p className="mt-2 text-sm font-semibold text-zinc-800">
            Arraste seu arquivo CSV ou clique para importar
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Formato aceito: carteira_pecuaria_2026.csv (colunas: id_operacao, data_pesagem, peso_medio, cabecas)
          </p>
          <button
            type="button"
            onClick={handleMockImport}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            <Upload className="h-3.5 w-3.5" />
            Simular Importação de Planilha
          </button>
        </div>

        {importedNotice && (
          <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Arquivo carteira_pecuaria_2026.csv processado: 16 registros validados sem inconsistências.</span>
          </div>
        )}
      </section>

      {/* Auditoria LGPD e Governança */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
        <div className="flex items-center gap-2 font-semibold text-zinc-900">
          <ShieldCheck className="h-4 w-4 text-zinc-700" />
          Conformidade e Governança do Modelo (LGPD Artigo 20)
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
          Este sistema adota metodologia transparente, sem caixas-pretas de aprendizado de máquina não-explicáveis.
          Cada nota gerada é passível de revisão manual e acompanhada de trilha de auditoria completa demonstrando a
          origem dos dados (estações INMET, satélites Sentinel-2, relatórios de pesagem e cotações públicas).
        </p>
      </div>
    </div>
  );
}
