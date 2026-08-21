import { forceUnlockBodyScroll } from '@/utils/bodyScrollLock'

const LONG_IDLE_MS = 2 * 60_000
const SHORT_IDLE_MS = 15_000

export const APP_RESUMED_EVENT = 'guc:app-resumed'

let lastHiddenAt = 0
let registered = false

function hiddenDurationMs(): number {
  if (!lastHiddenAt) return 0
  return Date.now() - lastHiddenAt
}

async function recoverUiState(): Promise<void> {
  forceUnlockBodyScroll()

  try {
    const { useConsentStore } = await import('@/stores/consent.store')
    const consent = useConsentStore()
    if (consent.preferencesModalOpen) {
      consent.closePreferences()
    }
  } catch {
    /* ignore */
  }
}

async function recoverSessionAndProof(idleMs: number): Promise<void> {
  try {
    const { invalidateRequestProofPool, ensureRequestProofPool } = await import(
      '@/composables/useRequestProof'
    )
    if (idleMs >= SHORT_IDLE_MS) {
      invalidateRequestProofPool()
      void ensureRequestProofPool()
    }
  } catch {
    /* ignore */
  }

  try {
    const { useAuthStore } = await import('@/stores/auth.store')
    const { startSessionRefreshScheduler, ensureSessionFreshOnResume } = await import(
      '@/composables/useSessionRefresh'
    )
    const auth = useAuthStore()
    if (auth.isAuthenticated) {
      // Evita modal de login preso em loading eterno após wake.
      if (auth.loading) {
        auth.loading = false
      }
      await ensureSessionFreshOnResume()
      startSessionRefreshScheduler()
    }
  } catch {
    /* ignore */
  }
}

async function onResume(reason: 'visibility' | 'pageshow' | 'online'): Promise<void> {
  const idleMs = hiddenDurationMs()
  lastHiddenAt = 0

  await recoverUiState()

  if (idleMs >= SHORT_IDLE_MS || reason === 'online') {
    await recoverSessionAndProof(Math.max(idleMs, SHORT_IDLE_MS))
  }

  window.dispatchEvent(
    new CustomEvent(APP_RESUMED_EVENT, {
      detail: { idleMs, reason, longIdle: idleMs >= LONG_IDLE_MS },
    }),
  )
}

function onVisibilityChange(): void {
  if (document.visibilityState === 'hidden') {
    lastHiddenAt = Date.now()
    return
  }
  void onResume('visibility')
}

function onPageShow(event: PageTransitionEvent): void {
  if (event.persisted || document.visibilityState === 'visible') {
    void onResume('pageshow')
  }
}

function onOnline(): void {
  void onResume('online')
}

export function registerAppLifecycleRecovery(): void {
  if (typeof window === 'undefined' || registered) return
  registered = true

  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('pageshow', onPageShow)
  window.addEventListener('online', onOnline)
}
