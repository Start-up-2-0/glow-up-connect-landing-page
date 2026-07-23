const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatBRL(value: number): string {
  return currencyFormatter.format(value)
}

export function aplicarDescontoPercentual(preco: number, percentual: number): number {
  if (percentual <= 0) return preco
  if (percentual >= 100) return 0
  return Math.round(preco * (1 - percentual / 100) * 100) / 100
}

export function formatLimite(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return 'Ilimitado'
  return String(valor)
}
