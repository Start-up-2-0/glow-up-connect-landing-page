<script setup lang="ts">
import { computed } from 'vue'
import type { PromocaoLancamento } from '@/types/plano.types'

const props = defineProps<{
  promocao: PromocaoLancamento
  variant?: 'default' | 'landing'
}>()

const isLanding = computed(() => props.variant === 'landing')
const descontoLabel = computed(() => `${props.promocao.percentualDescontoMensalidade}%`)
</script>

<template>
  <!-- Landing: fundo escuro contínuo -->
  <div
    v-if="isLanding"
    class="rounded-2xl border border-glow-gold/40 bg-glow-gold/10 px-5 py-4 text-center lg:px-6"
    role="status"
  >
    <p class="font-montserrat text-lg font-semibold leading-snug text-white">
      <span class="text-glow-gold">Promoção de lançamento</span>
      <span> — {{ promocao.diasTrial }} dias grátis + {{ descontoLabel }} off para sempre</span>
    </p>
    <p class="mt-1.5 font-poppins text-sm font-normal leading-relaxed text-white/70">
      Restam {{ promocao.vagasRestantes }} vagas. Cartão necessário; primeira cobrança com desconto após o período de teste.
    </p>
  </div>

  <!-- Dashboard / onboarding (quando embutido) -->
  <div
    v-else
    class="mb-8 rounded-2xl border border-glow-gold/50 bg-glow-promo-bg-dashboard px-5 py-4 text-center lg:px-6"
    role="status"
  >
    <p class="font-urbanist text-base font-semibold text-glow-text">
      Promoção de lançamento — {{ promocao.diasTrial }} dias grátis + {{ descontoLabel }} off para sempre
    </p>
    <p class="mt-1.5 text-sm text-glow-text/75">
      Restam {{ promocao.vagasRestantes }} vagas. Cartão necessário; primeira cobrança com desconto após o período de teste.
    </p>
  </div>
</template>
