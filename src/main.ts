import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import App from './App.vue'
import { routes } from './router/routes'
import { useConsentStore } from './stores/consent.store'
import './assets/main.css'

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
    }
  },
)
