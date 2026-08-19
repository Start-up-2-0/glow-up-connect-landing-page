/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.css' {
  const css: string
  export default css
}

declare module 'leaflet.markercluster'

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_SITE_URL: string
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_TOKEN_HEADER?: string
  readonly VITE_CAPTCHA_SITE_KEY?: string
  /** true = reativa planos, onboarding e descoberta de estabelecimentos/lojas */
  readonly VITE_FEATURE_LOJAS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
