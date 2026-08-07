<script setup lang="ts">
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import { lojaAgendarPath } from '@/constants/routes'

defineProps<{
  publicGuid: string
  nome: string
}>()
</script>

<template>
  <div class="loja-cta-bar" role="region" aria-label="Agendar atendimento">
    <div class="loja-cta-bar__inner">
      <div class="loja-cta-bar__copy">
        <p class="loja-cta-bar__eyebrow">Pronto para marcar?</p>
        <p class="loja-cta-bar__nome">{{ nome }}</p>
      </div>
      <LandingCtaButton
        label="Agendar agora"
        variant="gold"
        size="sm"
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
  border-top: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(10 7 24 / 0.88);
  backdrop-filter: blur(16px);
  padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
}

.loja-cta-bar__inner {
  margin: 0 auto;
  max-width: 72rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
}

.loja-cta-bar__eyebrow {
  margin: 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.45);
}

.loja-cta-bar__nome {
  margin: 0.15rem 0 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .loja-cta-bar__nome {
    max-width: 28rem;
  }
}
</style>
