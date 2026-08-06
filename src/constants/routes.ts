export const ROUTE_NAMES = {
  LANDING: 'landing',
  EXPLORAR_LOJAS: 'explorar-lojas',
  TERMOS_DE_USO: 'termos-de-uso',
  POLITICA_COOKIES: 'politica-cookies',
  LOJA_AGENDAR: 'loja-agendar',
} as const

export const ROUTE_PATHS = {
  HOME: '/',
  EXPLORAR_LOJAS: '/explorar-lojas',
  TERMOS_DE_USO: '/termos-de-uso',
  POLITICA_COOKIES: '/politica-de-cookies',
  LOJA_AGENDAR: '/loja/:publicGuid/agendar',
} as const

export const LANDING_PLANOS_HASH = '#planos'

export type AppLayout = 'landing' | 'public' | 'agendar-publico'

export function lojaAgendarPath(publicGuid: string): string {
  return `/loja/${publicGuid}/agendar`
}
