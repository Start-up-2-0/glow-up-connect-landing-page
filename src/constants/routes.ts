export const ROUTE_NAMES = {
  LANDING: 'landing',
  TERMOS_DE_USO: 'termos-de-uso',
  POLITICA_COOKIES: 'politica-cookies',
} as const

export const ROUTE_PATHS = {
  HOME: '/',
  TERMOS_DE_USO: '/termos-de-uso',
  POLITICA_COOKIES: '/politica-de-cookies',
} as const

export const LANDING_PLANOS_HASH = '#planos'

export type AppLayout = 'landing' | 'public'
