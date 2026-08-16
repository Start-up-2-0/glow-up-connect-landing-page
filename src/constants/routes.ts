export const ROUTE_NAMES = {
  LANDING: 'landing',
  EXPLORAR_LOJAS: 'explorar-lojas',
  TERMOS_DE_USO: 'termos-de-uso',
  POLITICA_COOKIES: 'politica-cookies',
  LOJA_PUBLICA: 'loja-publica',
  LOJA_AGENDAR: 'loja-agendar',
  CONVITE_EQUIPE: 'convite-equipe',
} as const

export const ROUTE_PATHS = {
  HOME: '/',
  EXPLORAR_LOJAS: '/explorar-lojas',
  TERMOS_DE_USO: '/termos-de-uso',
  POLITICA_COOKIES: '/politica-de-cookies',
  LOJA_PUBLICA: '/loja/:publicGuid',
  LOJA_AGENDAR: '/loja/:publicGuid/agendar',
  CONVITE_EQUIPE: '/convite/:token',
} as const

export const LANDING_PLANOS_HASH = '#planos'

export type AppLayout = 'landing' | 'public' | 'agendar-publico'

export function lojaPublicaPath(publicGuid: string): string {
  return `/loja/${publicGuid}`
}

export function lojaAgendarPath(publicGuid: string): string {
  return `/loja/${publicGuid}/agendar`
}

export function lojaAgendarComProfissionalPath(
  publicGuid: string,
  profissionalPublicGuid: string,
): string {
  return `/loja/${publicGuid}/agendar?profissional=${encodeURIComponent(profissionalPublicGuid)}`
}

export function conviteEquipePath(token: string): string {
  return `/convite/${encodeURIComponent(token)}`
}
