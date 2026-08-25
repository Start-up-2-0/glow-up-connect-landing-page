<script setup lang="ts">
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
</script>

<template>
  <div class="agendar-publico-shell overflow-x-clip bg-glow-canvas text-glow-text">
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        class="absolute -left-24 top-16 h-[380px] w-[380px] rounded-full bg-glow-gold-cta/20 blur-[120px]"
      />
      <div
        class="absolute -right-20 bottom-40 h-[340px] w-[340px] rounded-full bg-glow-gold/15 blur-[110px]"
      />
      <div class="absolute inset-0 landing-grain opacity-[0.06] mix-blend-overlay" />
    </div>

    <LandingNavbar />

    <main id="conteudo-principal" class="agendar-publico-main relative z-10 pt-20 sm:pt-24">
      <slot />
    </main>
  </div>
</template>
