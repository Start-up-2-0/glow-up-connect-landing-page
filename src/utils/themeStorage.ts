import { STORAGE_KEYS } from '@/constants/storageKeys'
import type { Theme } from '@/types/theme.types'

/** Mesma versão do glow-up-connect-app — reaplicar o padrão claro quando a identidade muda. */
export const CURRENT_THEME_VERSION = '4'

export const DEFAULT_THEME: Theme = 'light'

const THEME_COLOR = {
  light: '#ebe7f7',
  dark: '#0a0806',
} as const

export function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

export function migrateThemeIfNeeded(): void {
  if (typeof localStorage === 'undefined') return

  const storedVersion = localStorage.getItem(STORAGE_KEYS.THEME_VERSION)
  if (storedVersion === CURRENT_THEME_VERSION) return

  localStorage.setItem(STORAGE_KEYS.THEME, DEFAULT_THEME)
  localStorage.setItem(STORAGE_KEYS.THEME_VERSION, CURRENT_THEME_VERSION)
}

export function resolveStoredTheme(): Theme {
  if (typeof localStorage === 'undefined') return DEFAULT_THEME

  migrateThemeIfNeeded()

  const saved = localStorage.getItem(STORAGE_KEYS.THEME)
  return isTheme(saved) ? saved : DEFAULT_THEME
}

export function applyThemeToDocument(theme: Theme): void {
  if (typeof document === 'undefined') return

  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME_COLOR[theme])
}

export function persistTheme(theme: Theme): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.THEME, theme)
  localStorage.setItem(STORAGE_KEYS.THEME_VERSION, CURRENT_THEME_VERSION)
}
