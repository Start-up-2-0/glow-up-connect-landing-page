import { STORAGE_KEYS } from '@/constants/storageKeys'
import type { StoredSession } from '@/types/auth.types'

const memoryAccessToken: { value: string | null } = { value: null }

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

export function getAccessToken(): string | null {
  return memoryAccessToken.value ?? session.get(STORAGE_KEYS.ACCESS_TOKEN)
}

export function setAccessToken(token: string | null): void {
  memoryAccessToken.value = token
  if (token) session.set(STORAGE_KEYS.ACCESS_TOKEN, token)
  else session.remove(STORAGE_KEYS.ACCESS_TOKEN)
}

export function readStoredSession(): Partial<StoredSession> {
  const token = getAccessToken() ?? undefined
  return {
    token,
    expiresAt: session.get(STORAGE_KEYS.EXPIRES_AT) ?? undefined,
    refreshExpiresAt: session.get(STORAGE_KEYS.REFRESH_EXPIRES_AT) ?? undefined,
    sessaoAgendamentoPublico: session.get(STORAGE_KEYS.BOOKING_SESSION) === '1',
  }
}

export function persistSession(sessionData: StoredSession): void {
  setAccessToken(sessionData.token)
  session.set(STORAGE_KEYS.EXPIRES_AT, sessionData.expiresAt)
  session.set(STORAGE_KEYS.REFRESH_EXPIRES_AT, sessionData.refreshExpiresAt)
  if (sessionData.sessaoAgendamentoPublico) {
    session.set(STORAGE_KEYS.BOOKING_SESSION, '1')
  } else {
    session.remove(STORAGE_KEYS.BOOKING_SESSION)
  }
}

export function clearSessionStorage(): void {
  memoryAccessToken.value = null
  session.remove(STORAGE_KEYS.ACCESS_TOKEN)
  session.remove(STORAGE_KEYS.EXPIRES_AT)
  session.remove(STORAGE_KEYS.REFRESH_EXPIRES_AT)
  session.remove(STORAGE_KEYS.BOOKING_SESSION)
  try {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  } catch {
    // noop
  }
}
