export function formatBRL(value?: number | null) {
  if (typeof value !== "number") return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

