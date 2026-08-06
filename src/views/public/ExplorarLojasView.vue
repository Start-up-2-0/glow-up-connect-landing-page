<script setup lang="ts">
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingExplorarLojas from '@/components/landing/LandingExplorarLojas.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'
import LandingWhatsappFab from '@/components/landing/LandingWhatsappFab.vue'
import { useSeo } from '@/composables/useSeo'
import { ROUTE_PATHS } from '@/constants/routes'

useSeo({ path: ROUTE_PATHS.EXPLORAR_LOJAS })
</script>

<template>
  <div class="overflow-x-hidden bg-glow-inverse-surface text-white">
    <LandingNavbar />
    <main id="conteudo-principal" class="pt-20 md:pt-24">
      <LandingExplorarLojas variant="page" />
    </main>
    <LandingFooter />
    <LandingWhatsappFab />
  </div>
</template>
