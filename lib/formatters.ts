export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Valor resumido para destaque visual: "R$ 850 mil", "R$ 1,4 mi". */
export function formatCompactBRL(value: number): { amount: string; suffix: string } {
  if (value >= 1_000_000) {
    const amount = (value / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
    return { amount: `R$ ${amount}`, suffix: "mi" };
  }
  if (value >= 1_000) {
    return { amount: `R$ ${Math.round(value / 1_000)}`, suffix: "mil" };
  }
  return { amount: formatCurrencyBRL(value), suffix: "" };
}

export function formatNumberBR(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}
