import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authService } from '@/services/authService'
import type { CodigoAgendamentoPayload, LoginPayload, StoredSession, UserSummary } from '@/types/auth.types'
import {
  clearSessionStorage,
  hasActiveSessionHint,
  persistSession,
  readStoredSession,
} from '@/utils/session'
import {
  startSessionRefreshScheduler,
  stopSessionRefreshScheduler,
} from '@/composables/useSessionRefresh'

export const useAuthStore = defineStore('auth', () => {
  const sessionActive = ref(false)
  const expiresAt = ref<string | null>(null)
  const refreshExpiresAt = ref<string | null>(null)
  const usuario = ref<UserSummary | null>(null)
  const sessaoAgendamentoPublico = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => sessionActive.value)

  function applySession(session: StoredSession, options?: { persist?: boolean; booking?: boolean }) {
    sessionActive.value = true
    expiresAt.value = session.expiresAt
    refreshExpiresAt.value = session.refreshExpiresAt
    sessaoAgendamentoPublico.value = Boolean(options?.booking ?? session.sessaoAgendamentoPublico)

    if (options?.persist !== false) {
      persistSession({
        ...session,
        token: '',
        refreshToken: '',
        sessaoAgendamentoPublico: sessaoAgendamentoPublico.value,
      })
    }

    // Sessão de agendamento público não renova via refresh.
    if (sessaoAgendamentoPublico.value) {
      stopSessionRefreshScheduler()
      scheduleBookingExpiry()
    } else {
      startSessionRefreshScheduler()
    }
  }

  let bookingExpiryTimer: ReturnType<typeof setTimeout> | null = null

  function clearBookingExpiryTimer() {
    if (bookingExpiryTimer) {
      clearTimeout(bookingExpiryTimer)
      bookingExpiryTimer = null
    }
  }

  function scheduleBookingExpiry() {
    clearBookingExpiryTimer()
    if (!expiresAt.value) return
    const ms = new Date(expiresAt.value).getTime() - Date.now()
    if (ms <= 0) {
      clearSession()
      return
    }
    bookingExpiryTimer = setTimeout(() => {
      clearSession()
    }, ms)
  }

  function hydrateFromStorage() {
    const stored = readStoredSession()
    if (!hasActiveSessionHint() || !stored.expiresAt) {
      clearSession()
      return
    }

    const expiresMs = new Date(stored.expiresAt).getTime()
    if (Number.isNaN(expiresMs) || expiresMs <= Date.now()) {
      const refreshMs = stored.refreshExpiresAt
        ? new Date(stored.refreshExpiresAt).getTime()
        : NaN
      if (
        stored.sessaoAgendamentoPublico
        || Number.isNaN(refreshMs)
        || refreshMs <= Date.now()
      ) {
        clearSession()
        return
      }
    }

    sessionActive.value = true
    expiresAt.value = stored.expiresAt ?? null
    refreshExpiresAt.value = stored.refreshExpiresAt ?? null
    sessaoAgendamentoPublico.value = Boolean(stored.sessaoAgendamentoPublico)

    if (sessaoAgendamentoPublico.value) {
      scheduleBookingExpiry()
    } else {
      startSessionRefreshScheduler()
    }
  }

  function clearSession() {
    clearBookingExpiryTimer()
    sessionActive.value = false
    expiresAt.value = null
    refreshExpiresAt.value = null
    usuario.value = null
    sessaoAgendamentoPublico.value = false
    stopSessionRefreshScheduler()
    clearSessionStorage()
  }

  async function login(payload: LoginPayload) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authService.login(payload)
      const loginData = data.data
      applySession({
        token: '',
        refreshToken: '',
        expiresAt: loginData.expiresAt,
        refreshExpiresAt: loginData.refreshExpiresAt,
      }, { booking: false })
      usuario.value = loginData.usuario
      return loginData
    } catch (err) {
      error.value = 'Falha no login'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loginComCodigo(payload: CodigoAgendamentoPayload) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authService.autenticarPorCodigo(payload)
      const loginData = data.data
      applySession({
        token: '',
        refreshToken: '',
        expiresAt: loginData.expiresAt,
        refreshExpiresAt: loginData.refreshExpiresAt,
        sessaoAgendamentoPublico: true,
      }, { booking: true })
      usuario.value = loginData.usuario
      return loginData
    } catch (err) {
      error.value = 'Código inválido'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      if (sessionActive.value) {
        await authService.logout()
      }
    } catch {
      // logout local mesmo se API falhar
    } finally {
      clearSession()
      loading.value = false
    }
  }

  return {
    /** @deprecated Tokens não ficam mais no JS; mantido vazio por compatibilidade. */
    token: computed(() => null as string | null),
    expiresAt,
    refreshExpiresAt,
    usuario,
    sessaoAgendamentoPublico,
    loading,
    error,
    isAuthenticated,
    login,
    loginComCodigo,
    logout,
    hydrateFromStorage,
    clearSession,
    applySession,
  }
})
