<script setup lang="ts">
import { computed } from 'vue'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import LandingPlanoLimites from '@/components/landing/LandingPlanoLimites.vue'
import { appOnboardingUrl } from '@/constants/urls'
import { aplicarDescontoPercentual, formatBRL } from '@/utils/formatters'
import { getPlanoFeatures, LANDING_PLANO_MAX_FEATURES } from '@/utils/planoDisplay'
import { TIPO_ASSINATURA_PADRAO } from '@/utils/tipoAssinatura'
import type { Plano, TipoAssinatura } from '@/types/plano.types'

const props = withDefaults(
  defineProps<{
    plano: Plano
    popular?: boolean
    percentualDesconto?: number | null
    tipoAssinatura?: TipoAssinatura
  }>(),
  {
    popular: false,
    percentualDesconto: null,
    tipoAssinatura: TIPO_ASSINATURA_PADRAO,
  },
)

const emit = defineEmits<{
  verDetalhes: [plano: Plano]
}>()

const checkoutHref = computed(() => appOnboardingUrl(props.plano.id, props.tipoAssinatura))

const features = computed(() => getPlanoFeatures(props.plano))

const visibleFeatures = computed(() => features.value.slice(0, LANDING_PLANO_MAX_FEATURES))

const hiddenFeaturesCount = computed(() =>
  Math.max(0, features.value.length - LANDING_PLANO_MAX_FEATURES),
)

const temDesconto = computed(() => (props.percentualDesconto ?? 0) > 0)

const precoComDesconto = computed(() =>
  temDesconto.value
    ? aplicarDescontoPercentual(props.plano.preco, props.percentualDesconto!)
    : props.plano.preco,
)
</script>

<template>
  <article
    class="landing-plano-card landing-glass-card relative flex h-full flex-col rounded-3xl border border-glow-border-soft bg-glow-surface p-8 transition duration-300 hover:border-glow-gold/30 hover:bg-glow-hover-surface sm:p-10"
    :class="popular && 'landing-plano-card--popular ring-2 ring-glow-gold/25'"
  >
    <div class="mb-6 flex h-6 items-center justify-center">
      <div v-if="popular" class="flex items-center gap-2">
        <svg
          class="size-4 text-glow-gold"
          style="animation: landing-float 3.5s ease-in-out infinite"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.9H22l-5.5 4.5 2.1 6.6L12 16.9 5.4 20l2.1-6.6L2 8.9h7.1L12 2z" />
        </svg>
        <span class="font-montserrat text-sm font-medium text-glow-gold">POPULAR</span>
      </div>
    </div>

    <div class="flex min-h-[3.5rem] items-start justify-between gap-3">
      <h3 class="font-montserrat text-2xl font-semibold leading-[1.09] text-glow-text">
        {{ plano.nome }}
      </h3>
      <span
        v-if="plano.prioridadeListagemPublica && !popular"
        class="shrink-0 rounded-full bg-glow-gold/15 px-2 py-0.5 font-montserrat text-[10px] font-medium text-glow-gold"
      >
        Destaque no marketplace
      </span>
    </div>

    <p class="mt-5 min-h-[3.25rem] line-clamp-3 font-poppins text-base font-light leading-[1.2] text-glow-text-subtle">
      {{ plano.descricao }}
    </p>

    <div class="mt-6">
      <template v-if="temDesconto">
        <p class="font-montserrat text-sm font-medium text-glow-gold/60 line-through">
          {{ formatBRL(plano.preco) }}/mês
        </p>
        <p class="inline font-montserrat text-2xl font-black leading-[1.09] text-glow-gold">
          {{ formatBRL(precoComDesconto) }}
        </p>
        <span class="ml-1 font-montserrat text-[10px] font-bold text-glow-gold">/mês</span>
        <p class="mt-1 font-montserrat text-xs font-semibold text-glow-gold">
          {{ percentualDesconto }}% off para sempre
        </p>
      </template>
      <template v-else>
        <p class="inline font-montserrat text-2xl font-black leading-[1.09] text-glow-gold">
          {{ formatBRL(plano.preco) }}
        </p>
        <span class="ml-1 font-montserrat text-[10px] font-bold text-glow-gold">/mês</span>
      </template>
    </div>

    <LandingPlanoLimites class="mt-5" :plano="plano" variant="card" />

    <ul class="mt-5 min-h-[9.5rem] flex-1 space-y-0.5">
      <li
        v-for="feature in visibleFeatures"
        :key="feature"
        class="flex items-start gap-2.5 py-1.5"
      >
        <svg
          class="mt-0.5 size-5 shrink-0 text-glow-gold"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
        </svg>
        <span class="line-clamp-2 font-poppins text-sm font-light leading-snug text-glow-text-subtle">
          {{ feature }}
        </span>
      </li>
    </ul>

    <button
      v-if="hiddenFeaturesCount > 0"
      type="button"
      class="mt-3 w-full text-center font-montserrat text-sm font-semibold text-glow-gold underline-offset-2 transition hover:underline"
      @click="emit('verDetalhes', plano)"
    >
      Ver benefícios completos
      <span class="font-normal opacity-80">(+{{ hiddenFeaturesCount }})</span>
    </button>
    <div v-else class="mt-3 h-5" aria-hidden="true" />

    <LandingCtaButton
      class="mx-auto mt-6 w-full max-w-[259px] justify-center"
      :class="popular && 'landing-cta--pulse'"
      :href="checkoutHref"
      label="Assinar agora"
      variant="gold"
    />
  </article>
</template>
