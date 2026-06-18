export const APP_URL = (import.meta.env.VITE_APP_URL?.trim() || 'https://app.glowupconnect.com.br').replace(
  /\/+$/,
  '',
)

export const SITE_URL = (import.meta.env.VITE_SITE_URL?.trim() || 'https://glowupconnect.com.br').replace(
  /\/+$/,
  '',
)

export function appOnboardingUrl(planoId: number | string): string {
  return `${APP_URL}/onboarding/assinatura?planoId=${encodeURIComponent(String(planoId))}`
}

export function siteUrl(path = ''): string {
  if (!path) return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
