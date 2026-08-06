<script setup lang="ts">
import LandingExplorarLojas from '@/components/landing/LandingExplorarLojas.vue'
import LandingWhatsappFab from '@/components/landing/LandingWhatsappFab.vue'
import { useSeo } from '@/composables/useSeo'
import { ROUTE_PATHS } from '@/constants/routes'

useSeo({ path: ROUTE_PATHS.EXPLORAR_LOJAS })
</script>

<template>
  <div class="relative h-dvh overflow-hidden bg-[#0b0b0b] text-white">
    <h1 class="sr-only">Explorar Lojas</h1>
    <main id="conteudo-principal" class="h-full">
      <LandingExplorarLojas variant="page" />
    </main>
    <LandingWhatsappFab />
  </div>
</template>
