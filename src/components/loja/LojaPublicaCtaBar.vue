<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import { lojaAgendarPath, ROUTE_PATHS } from '@/constants/routes'

defineProps<{
  publicGuid: string
  nome: string
}>()
</script>

<template>
  <div class="loja-cta-bar" role="region" aria-label="Agendar atendimento">
    <div class="loja-cta-bar__inner">
      <div class="min-w-0">
        <p class="font-satoshi text-[10px] font-semibold uppercase tracking-[0.16em] text-glow-gold/80">
          Pronto para marcar?
        </p>
        <p class="mt-0.5 truncate font-montserrat text-sm font-semibold text-glow-text sm:text-base">
          {{ nome }}
        </p>
        <RouterLink
          :to="ROUTE_PATHS.EXPLORAR_LOJAS"
          class="mt-1 inline-block font-satoshi text-xs font-medium text-glow-placeholder transition hover:text-glow-text-subtle"
        >
          Explorar outras lojas
        </RouterLink>
      </div>
      <LandingCtaButton
        label="Agendar agora"
        variant="gold"
        size="sm"
        class="shrink-0"
        :to="lojaAgendarPath(publicGuid)"
      />
    </div>
  </div>
</template>

<style scoped>
.loja-cta-bar {
  position: sticky;
  bottom: 0;
  z-index: 40;
  border-top: 1px solid var(--glow-border-soft);
  background: color-mix(in srgb, var(--glow-canvas) 90%, transparent);
  backdrop-filter: blur(18px);
  padding: 0.85rem 1rem calc(0.85rem + env(safe-area-inset-bottom));
}

.loja-cta-bar__inner {
  margin: 0 auto;
  max-width: 80rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
</style>
