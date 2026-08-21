import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import App from './App.vue'
import { routes } from './router/routes'
import { useConsentStore } from './stores/consent.store'
import './assets/main.css'

function scheduleIdleWork(fn: () => void, timeout = 2500): void {
  if (typeof window === 'undefined') return
  const ric = (
    window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }
  ).requestIdleCallback
  if (typeof ric === 'function') {
    ric(fn, { timeout })
  } else {
    window.setTimeout(fn, 1)
  }
}

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, top: 88, behavior: 'smooth' }
    }
    return { top: 0, left: 0 }
  } },
  ({ app, isClient }) => {
    const pinia = createPinia()
    app.use(pinia)

    const consentStore = useConsentStore(pinia)
    if (isClient) {
      consentStore.hydrate()

      void import('@/composables/useAppLifecycleRecovery').then(({ registerAppLifecycleRecovery }) => {
        registerAppLifecycleRecovery()
      })

      void import('@/stores/auth.store').then(({ useAuthStore }) => {
        const auth = useAuthStore(pinia)
        auth.hydrateFromStorage()
        if (auth.isAuthenticated) {
          void import('@/composables/useSessionRefresh').then(({ startSessionRefreshScheduler }) => {
            startSessionRefreshScheduler()
          })
        }
      })

      // Proof pool após first paint — não compete com LCP da landing.
      scheduleIdleWork(() => {
        void import('@/composables/useRequestProof').then(({ ensureRequestProofPool }) => {
          void ensureRequestProofPool()
        })
      })
    }
  },
)
