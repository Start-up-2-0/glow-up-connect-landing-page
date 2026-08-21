import { authService } from '@/services/authService'
import { persistSession, readStoredSession } from '@/utils/session'

const REFRESH_MARGIN_MS = 60_000

let refreshTimer: ReturnType<typeof setTimeout> | null = null
let refreshInFlight: Promise<void> | null = null

function clearRefreshTimer(): void {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

async function performRefresh(): Promise<void> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    const { data } = await authService.refresh()
    persistSession({
      token: '',
      refreshToken: '',
      expiresAt: data.data.expiresAt,
      refreshExpiresAt: data.data.refreshExpiresAt,
    })
  })().finally(() => {
    refreshInFlight = null
  })

  return refreshInFlight
}

export function startSessionRefreshScheduler(): void {
  clearRefreshTimer()

  const { expiresAt } = readStoredSession()
  if (!expiresAt) return

  const expiresMs = new Date(expiresAt).getTime()
  if (Number.isNaN(expiresMs)) return

  const delay = expiresMs - Date.now() - REFRESH_MARGIN_MS
  const wait = Math.max(delay, 0)

  refreshTimer = setTimeout(async () => {
    try {
      await performRefresh()
      startSessionRefreshScheduler()
    } catch {
      clearRefreshTimer()
    }
  }, wait)
}

export function stopSessionRefreshScheduler(): void {
  clearRefreshTimer()
}

export async function ensureSessionFreshOnResume(): Promise<boolean> {
  const { expiresAt } = readStoredSession()
  if (!expiresAt) return false

  const expiresMs = new Date(expiresAt).getTime()
  if (Number.isNaN(expiresMs)) return false

  const remaining = expiresMs - Date.now()
  if (remaining > REFRESH_MARGIN_MS) {
    startSessionRefreshScheduler()
    return true
  }

  try {
    await performRefresh()
    startSessionRefreshScheduler()
    return true
  } catch {
    clearRefreshTimer()
    return false
  }
}
