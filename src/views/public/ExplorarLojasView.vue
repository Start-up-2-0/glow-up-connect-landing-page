<script setup lang="ts">
import LandingExplorarLojas from '@/components/landing/LandingExplorarLojas.vue'
import { FEATURE_FLAGS } from '@/config/features'
import { useSeo } from '@/composables/useSeo'
import { ROUTE_PATHS } from '@/constants/routes'

useSeo({
  path: ROUTE_PATHS.EXPLORAR_LOJAS,
  title: FEATURE_FLAGS.lojasHabilitadas
    ? undefined
    : 'Explorar profissionais | Glow Up Connect',
  description: FEATURE_FLAGS.lojasHabilitadas
    ? undefined
    : 'Encontre profissionais autônomos próximos no mapa. Veja avaliações, distância e agende online no Glow Up Connect.',
})
</script>

<template>
  <div class="relative h-dvh overflow-hidden bg-glow-canvas text-glow-text">
    <h1 class="sr-only">
      {{ FEATURE_FLAGS.lojasHabilitadas ? 'Explorar lojas e profissionais' : 'Explorar profissionais' }}
    </h1>
    <main id="conteudo-principal" class="h-full">
      <LandingExplorarLojas variant="page" />
    </main>
  </div>
</template>
