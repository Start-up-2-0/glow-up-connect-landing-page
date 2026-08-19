import { TIPO_ASSINATURA_PADRAO } from '@/utils/tipoAssinatura'

export const APP_URL = (import.meta.env.VITE_APP_URL?.trim() || 'https://app.glowupconnect.com.br').replace(
  /\/+$/,
  '',
)

export const SITE_URL = (import.meta.env.VITE_SITE_URL?.trim() || 'https://glowupconnect.com.br').replace(
  /\/+$/,
  '',
)

export function appOnboardingUrl(
  planoId: number | string,
  tipoAssinatura: 'Estabelecimento' | 'ProfissionalAutonomo' = TIPO_ASSINATURA_PADRAO,
): string {
  const params = new URLSearchParams({
    planoId: String(planoId),
    tipoAssinatura,
  })
  return `${APP_URL}/onboarding/assinatura?${params.toString()}`
}

export function siteUrl(path = ''): string {
  if (!path) return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
