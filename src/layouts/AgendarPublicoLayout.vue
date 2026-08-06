<script setup lang="ts">
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'
</script>

<template>
  <div class="agendar-publico-shell overflow-x-clip bg-glow-inverse-surface text-white">
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        class="absolute -left-24 top-16 h-[380px] w-[380px] rounded-full bg-glow-gold-cta/20 blur-[120px]"
      />
      <div
        class="absolute -right-20 bottom-40 h-[340px] w-[340px] rounded-full bg-glow-purple/35 blur-[110px]"
      />
      <div class="absolute inset-0 landing-grain opacity-[0.06] mix-blend-overlay" />
    </div>

    <LandingNavbar />

    <main id="conteudo-principal" class="agendar-publico-main relative z-10 pt-24 sm:pt-28">
      <slot />
    </main>

    <div class="relative z-10">
      <LandingFooter />
    </div>
  </div>
</template>
