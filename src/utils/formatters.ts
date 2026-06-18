const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatBRL(value: number): string {
  return currencyFormatter.format(value)
}

export function formatLimite(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return 'Ilimitado'
  return String(valor)
}
