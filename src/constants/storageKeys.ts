export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Glow Up Connect'

function normalizeApiBaseUrl(raw: string | undefined): string {
  const value = raw?.trim() || '/api'
  const withoutTrailingSlash = value.replace(/\/+$/, '')

  if (/^https?:\/\//i.test(withoutTrailingSlash) && !withoutTrailingSlash.endsWith('/api')) {
    return `${withoutTrailingSlash}/api`
  }

  return withoutTrailingSlash
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)
