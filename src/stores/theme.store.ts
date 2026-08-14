import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Theme } from '@/types/theme.types'
import {
  applyThemeToDocument,
  DEFAULT_THEME,
  persistTheme,
  resolveStoredTheme,
} from '@/utils/themeStorage'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(DEFAULT_THEME)
  const isDark = computed(() => theme.value === 'dark')

  function applyTheme(value: Theme) {
    theme.value = value
    applyThemeToDocument(value)
    persistTheme(value)
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function hydrateTheme() {
    applyTheme(resolveStoredTheme())
  }

  return {
    theme,
    isDark,
    applyTheme,
    toggleTheme,
    hydrateTheme,
  }
})
