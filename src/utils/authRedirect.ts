import { APP_URL, SITE_URL } from '@/constants/urls'

/** Paths de auth no app (glow-up-connect-app). */
export const APP_AUTH_PATHS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CONFIRM_EMAIL: '/auth/confirmar-email',
  MEUS_AGENDAMENTOS: '/meus-agendamentos',
  DASHBOARD: '/dashboard',
} as const

/**
 * Normaliza o destino de retorno após login/cadastro no app.
 * Paths relativos viram URL absoluta da landing (SITE_URL).
 */
export function resolveRedirectTarget(redirect?: string): string | undefined {
  if (!redirect) return undefined
  if (redirect.startsWith('http://') || redirect.startsWith('https://')) return redirect
  if (redirect.startsWith('/')) return `${SITE_URL}${redirect}`
  return undefined
}

/** Monta URL absoluta no app, opcionalmente com `?redirect=`. */
export function authAppUrl(path: string, redirect?: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${APP_URL}${normalizedPath}`)
  const target = resolveRedirectTarget(redirect)
  if (target) url.searchParams.set('redirect', target)
  return url.toString()
}

export function authLoginUrl(redirect?: string): string {
  return authAppUrl(APP_AUTH_PATHS.LOGIN, redirect)
}

export function authRegisterUrl(redirect?: string): string {
  return authAppUrl(APP_AUTH_PATHS.REGISTER, redirect)
}

export function authConfirmEmailUrl(redirect?: string): string {
  return authAppUrl(APP_AUTH_PATHS.CONFIRM_EMAIL, redirect)
}

export function appMeusAgendamentosUrl(): string {
  return authAppUrl(APP_AUTH_PATHS.MEUS_AGENDAMENTOS)
}

export function appDashboardUrl(): string {
  return authAppUrl(APP_AUTH_PATHS.DASHBOARD)
}
