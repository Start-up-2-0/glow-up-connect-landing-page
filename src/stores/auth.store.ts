import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authService } from '@/services/authService'
import type { CodigoAgendamentoPayload, LoginPayload, StoredSession, UserSummary } from '@/types/auth.types'
import {
  clearSessionStorage,
  persistSession,
  readStoredSession,
} from '@/utils/session'
import {
  startSessionRefreshScheduler,
  stopSessionRefreshScheduler,
} from '@/composables/useSessionRefresh'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const expiresAt = ref<string | null>(null)
  const refreshExpiresAt = ref<string | null>(null)
  const usuario = ref<UserSummary | null>(null)
  const sessaoAgendamentoPublico = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  function applySession(session: StoredSession, options?: { persist?: boolean; booking?: boolean }) {
    token.value = session.token
    expiresAt.value = session.expiresAt
    refreshExpiresAt.value = session.refreshExpiresAt
    sessaoAgendamentoPublico.value = Boolean(options?.booking ?? session.sessaoAgendamentoPublico)

    if (options?.persist !== false) {
      persistSession({
        ...session,
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
    if (stored.token) token.value = stored.token
    if (stored.expiresAt) expiresAt.value = stored.expiresAt
    if (stored.refreshExpiresAt) refreshExpiresAt.value = stored.refreshExpiresAt
    sessaoAgendamentoPublico.value = Boolean(stored.sessaoAgendamentoPublico)

    if (!stored.token || !stored.expiresAt) return

    const expiresMs = new Date(stored.expiresAt).getTime()
    if (Number.isNaN(expiresMs) || expiresMs <= Date.now()) {
      clearSession()
      return
    }

    if (sessaoAgendamentoPublico.value) {
      scheduleBookingExpiry()
    } else {
      startSessionRefreshScheduler()
    }
  }

  function clearSession() {
    clearBookingExpiryTimer()
    token.value = null
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
        token: loginData.token,
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
        token: loginData.token,
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
      if (token.value) {
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
    token,
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
