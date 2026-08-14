<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LandingLayout from '@/layouts/LandingLayout.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AgendarPublicoLayout from '@/layouts/AgendarPublicoLayout.vue'
import CookieConsentBanner from '@/components/legal/CookieConsentBanner.vue'
import CookiePreferencesModal from '@/components/legal/CookiePreferencesModal.vue'
import { useConsent } from '@/composables/useConsent'
import { useThemeStore } from '@/stores/theme.store'

const route = useRoute()
const { showBanner } = useConsent()
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.hydrateTheme()
})

const layout = computed(() => {
  if (route.meta.layout === 'agendar-publico') return AgendarPublicoLayout
  if (route.meta.layout === 'public') return PublicLayout
  return LandingLayout
})
</script>

<template>
  <a href="#conteudo-principal" class="skip-link">Ir para o conteúdo</a>
  <component :is="layout">
    <router-view />
  </component>
  <CookieConsentBanner v-if="showBanner" />
  <CookiePreferencesModal />
</template>
