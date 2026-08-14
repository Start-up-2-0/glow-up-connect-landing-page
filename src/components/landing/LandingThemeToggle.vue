<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme.store'
import IconMoon from '@/components/landing/icons/IconMoon.vue'
import IconSun from '@/components/landing/icons/IconSun.vue'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
</script>

<template>
  <button
    type="button"
    class="flex size-10 shrink-0 items-center justify-center rounded-full border border-glow-border-soft bg-glow-surface text-glow-text transition hover:bg-glow-hover-surface"
    :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
    @click="themeStore.toggleTheme()"
  >
    <IconSun v-if="isDark" :size="18" />
    <IconMoon v-else :size="18" />
  </button>
</template>
