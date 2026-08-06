const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const TELEFONE_BR_DDI = '55'
export const TELEFONE_LOCAL_MAX_LENGTH = 11

export function normalizeTelefone(telefone: string | null | undefined): string {
  if (!telefone) return ''
  return telefone.replace(/\D/g, '')
}

/** Remove o DDI 55 para exibição no campo de edição. */
export function telefoneLocalFromApi(telefone: string | null | undefined): string {
  const digits = normalizeTelefone(telefone)
  if (!digits) return ''
  if (digits.startsWith(TELEFONE_BR_DDI)) return digits.slice(TELEFONE_BR_DDI.length)
  return digits
}

/** Monta o telefone completo para a API (sempre com prefixo 55). */
export function telefoneToApi(local: string | null | undefined): string {
  const digits = normalizeTelefone(local)
  if (!digits) return ''
  if (digits.startsWith(TELEFONE_BR_DDI)) return digits
  return `${TELEFONE_BR_DDI}${digits}`
}

/** Normaliza entrada do usuário, removendo DDI se colado junto. */
export function telefoneLocalFromInput(value: string): string {
  let digits = normalizeTelefone(value)
  if (digits.startsWith(TELEFONE_BR_DDI) && digits.length > TELEFONE_BR_DDI.length) {
    digits = digits.slice(TELEFONE_BR_DDI.length)
  }
  return digits.slice(0, TELEFONE_LOCAL_MAX_LENGTH)
}

/** Máscara visual para DDD + número (sem DDI). */
export function maskTelefoneLocal(digits: string): string {
  const d = digits.slice(0, TELEFONE_LOCAL_MAX_LENGTH)
  if (!d) return ''
  if (d.length <= 2) return `(${d}`

  const ddd = d.slice(0, 2)
  const rest = d.slice(2)
  const isMobile = rest[0] === '9'

  if (isMobile) {
    if (rest.length <= 5) return `(${ddd}) ${rest}`
    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`
  }

  if (rest.length <= 4) return `(${ddd}) ${rest}`
  return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`
}

/** Máscara unificada com DDI (+55) em um único campo. */
export function maskTelefoneUnified(digits: string): string {
  const local = maskTelefoneLocal(digits)
  if (!local) return ''
  return `+55 ${local}`
}

export function formatTelefone(telefone: string | null | undefined): string {
  if (!telefone) return '—'
  const digits = normalizeTelefone(telefone)
  if (digits.length === 13 && digits.startsWith('55')) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return telefone
}

/** Garante interpretação UTC wall-clock quando a API omite o sufixo Z. */
export function normalizeAgendaIso(iso: string): string {
  if (!iso) return iso
  if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(iso)) return iso
  return `${iso}Z`
}

/**
 * Horário de agenda: a API persiste o relógio local do estabelecimento com Kind UTC.
 * Evita deslocamento de fuso ao exibir no navegador.
 */
export function formatAgendaTime(iso: string): string {
  const d = new Date(normalizeAgendaIso(iso))
  const hours = String(d.getUTCHours()).padStart(2, '0')
  const minutes = String(d.getUTCMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/** Data ISO (yyyy-MM-dd) a partir de timestamp de agenda em UTC wall-clock. */
export function toDateOnlyFromIsoUtc(iso: string): string {
  const d = new Date(normalizeAgendaIso(iso))
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export const formatBRL = formatCurrency

export function aplicarDescontoPercentual(preco: number, percentual: number): number {
  if (percentual <= 0) return preco
  if (percentual >= 100) return 0
  return Math.round(preco * (1 - percentual / 100) * 100) / 100
}

export function formatLimite(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return 'Ilimitado'
  return String(valor)
}

export function formatPrecoRange(min: number, max: number): string {
  if (min === max) return formatCurrency(min)
  return `${formatCurrency(min)} – ${formatCurrency(max)}`
}

export function formatDistanciaKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1).replace('.', ',')} km`
}

/** Rótulo curto para datas ISO (yyyy-MM-dd) sem ambiguidade de fuso. */
export function formatDateOnlyLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date)
}

/** Rótulo longo para revisão (ex.: segunda-feira, 08 de junho de 2026). */
export function formatDateOnlyLong(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/** Rótulo médio para horário (ex.: segunda-feira, 08 de junho). */
export function formatDateOnlyMedium(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(date)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function toDateOnlyString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDaysToDateOnly(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return toDateOnlyString(date)
}

/** Horário HH:mm:ss para API a partir de timestamp de agenda em UTC wall-clock. */
export function toAgendaTimeOnlyString(iso: string): string {
  const d = new Date(normalizeAgendaIso(iso))
  const hours = String(d.getUTCHours()).padStart(2, '0')
  const minutes = String(d.getUTCMinutes()).padStart(2, '0')
  const seconds = String(d.getUTCSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
