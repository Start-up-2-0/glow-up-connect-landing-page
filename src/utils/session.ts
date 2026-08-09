import { STORAGE_KEYS } from '@/constants/storageKeys'
import type { StoredSession } from '@/types/auth.types'

function sessionStorageSafe() {
  return {
    get(key: string): string | null {
      try {
        return sessionStorage.getItem(key)
      } catch {
        return null
      }
    },
    set(key: string, value: string): void {
      try {
        sessionStorage.setItem(key, value)
      } catch {
        // quota exceeded ou modo privado
      }
    },
    remove(key: string): void {
      try {
        sessionStorage.removeItem(key)
      } catch {
        // noop
      }
    },
  }
}

const session = sessionStorageSafe()

/** Metadados de sessão (sem segredos). Tokens ficam só em cookies HttpOnly. */
export function readStoredSession(): Partial<StoredSession> {
  const active = session.get(STORAGE_KEYS.SESSION_ACTIVE) === '1'
  if (!active) {
    return {}
  }

  return {
    token: '',
    refreshToken: '',
    expiresAt: session.get(STORAGE_KEYS.EXPIRES_AT) ?? undefined,
    refreshExpiresAt: session.get(STORAGE_KEYS.REFRESH_EXPIRES_AT) ?? undefined,
    sessaoAgendamentoPublico: session.get(STORAGE_KEYS.BOOKING_SESSION) === '1',
  }
}

export function persistSession(sessionData: StoredSession): void {
  session.set(STORAGE_KEYS.SESSION_ACTIVE, '1')
  session.set(STORAGE_KEYS.EXPIRES_AT, sessionData.expiresAt)
  session.set(STORAGE_KEYS.REFRESH_EXPIRES_AT, sessionData.refreshExpiresAt)
  if (sessionData.sessaoAgendamentoPublico) {
    session.set(STORAGE_KEYS.BOOKING_SESSION, '1')
  } else {
    session.remove(STORAGE_KEYS.BOOKING_SESSION)
  }
  session.remove(STORAGE_KEYS.ACCESS_TOKEN)
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  } catch {
    // noop
  }
}

export function clearSessionStorage(): void {
  session.remove(STORAGE_KEYS.SESSION_ACTIVE)
  session.remove(STORAGE_KEYS.EXPIRES_AT)
  session.remove(STORAGE_KEYS.REFRESH_EXPIRES_AT)
  session.remove(STORAGE_KEYS.BOOKING_SESSION)
  session.remove(STORAGE_KEYS.ACCESS_TOKEN)
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  } catch {
    // noop
  }
}

export function hasActiveSessionHint(): boolean {
  return session.get(STORAGE_KEYS.SESSION_ACTIVE) === '1'
}
