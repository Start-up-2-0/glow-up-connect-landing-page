<script setup lang="ts">
import { computed } from 'vue'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import LandingPlanoLimites from '@/components/landing/LandingPlanoLimites.vue'
import { appOnboardingUrl } from '@/constants/urls'
import { aplicarDescontoPercentual, formatBRL } from '@/utils/formatters'
import { getPlanoFeatures, LANDING_PLANO_MAX_FEATURES } from '@/utils/planoDisplay'
import type { Plano } from '@/types/plano.types'

const props = defineProps<{
  plano: Plano
  popular?: boolean
  percentualDesconto?: number | null
}>()

const emit = defineEmits<{
  verDetalhes: [plano: Plano]
}>()

const checkoutHref = computed(() => appOnboardingUrl(props.plano.id))

const features = computed(() => getPlanoFeatures(props.plano))

const visibleFeatures = computed(() => features.value.slice(0, LANDING_PLANO_MAX_FEATURES))

const hiddenFeaturesCount = computed(() =>
  Math.max(0, features.value.length - LANDING_PLANO_MAX_FEATURES),
)

const ctaVariant = computed(() => (props.popular ? 'purple' : 'outline'))

const temDesconto = computed(() => (props.percentualDesconto ?? 0) > 0)

const precoComDesconto = computed(() =>
  temDesconto.value
    ? aplicarDescontoPercentual(props.plano.preco, props.percentualDesconto!)
    : props.plano.preco,
)

const priceAccent = computed(() => (props.popular ? 'text-glow-purple' : 'text-glow-gold'))
</script>

<template>
  <article
    class="landing-plano-card relative flex h-full flex-col rounded-3xl border p-8 sm:p-10"
    :class="
      popular
        ? 'landing-plano-card--popular border-glow-purple/60 bg-glow-purple/20 ring-2 ring-glow-purple/30'
        : 'border-white/15 bg-white/[0.06] landing-glass-card hover:border-glow-gold/30 hover:bg-white/[0.08]'
    "
  >
    <div class="mb-6 flex h-6 items-center justify-center">
      <div v-if="popular" class="flex items-center gap-2">
        <svg
          class="size-4 text-glow-purple"
          style="animation: landing-float 3.5s ease-in-out infinite"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.9H22l-5.5 4.5 2.1 6.6L12 16.9 5.4 20l2.1-6.6L2 8.9h7.1L12 2z" />
        </svg>
        <span class="font-montserrat text-sm font-medium text-glow-purple">POPULAR</span>
      </div>
    </div>

    <div class="flex min-h-[3.5rem] items-start justify-between gap-3">
      <h3
        class="font-montserrat text-2xl font-semibold leading-[1.09]"
        :class="popular ? 'text-glow-purple' : 'text-glow-gold'"
      >
        {{ plano.nome }}
      </h3>
      <span
        v-if="plano.prioridadeListagemPublica && !popular"
        class="shrink-0 rounded-full bg-glow-gold/15 px-2 py-0.5 font-montserrat text-[10px] font-medium text-glow-gold"
      >
        Destaque no marketplace
      </span>
    </div>

    <p
      class="mt-5 min-h-[3.25rem] line-clamp-3 font-poppins text-base font-light leading-[1.2]"
      :class="popular ? 'text-glow-purple-soft' : 'text-white/70'"
    >
      {{ plano.descricao }}
    </p>

    <div class="mt-6">
      <template v-if="temDesconto">
        <p
          class="font-montserrat text-sm font-medium line-through opacity-60"
          :class="priceAccent"
        >
          {{ formatBRL(plano.preco) }}/mês
        </p>
        <p
          class="inline font-montserrat text-2xl font-black leading-[1.09]"
          :class="priceAccent"
        >
          {{ formatBRL(precoComDesconto) }}
        </p>
        <span class="ml-1 font-montserrat text-[10px] font-bold" :class="priceAccent">
          /mês
        </span>
        <p class="mt-1 font-montserrat text-xs font-semibold" :class="priceAccent">
          {{ percentualDesconto }}% off para sempre
        </p>
      </template>
      <template v-else>
        <p
          class="inline font-montserrat text-2xl font-black leading-[1.09]"
          :class="priceAccent"
        >
          {{ formatBRL(plano.preco) }}
        </p>
        <span class="ml-1 font-montserrat text-[10px] font-bold" :class="priceAccent">
          /mês
        </span>
      </template>
    </div>

    <LandingPlanoLimites class="mt-5" :plano="plano" :popular="popular" variant="card" />

    <ul class="mt-5 min-h-[9.5rem] flex-1 space-y-0.5">
      <li
        v-for="feature in visibleFeatures"
        :key="feature"
        class="flex items-start gap-2.5 py-1.5"
      >
        <svg
          class="mt-0.5 size-5 shrink-0"
          :class="popular ? 'text-glow-purple' : 'text-glow-gold'"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
        </svg>
        <span
          class="line-clamp-2 font-poppins text-sm font-light leading-snug"
          :class="popular ? 'text-glow-purple-soft' : 'text-white/75'"
        >
          {{ feature }}
        </span>
      </li>
    </ul>

    <button
      v-if="hiddenFeaturesCount > 0"
      type="button"
      class="mt-3 w-full text-center font-montserrat text-sm font-semibold underline-offset-2 transition hover:underline"
      :class="popular ? 'text-glow-purple' : 'text-glow-gold'"
      @click="emit('verDetalhes', plano)"
    >
      Ver benefícios completos
      <span class="font-normal opacity-80">(+{{ hiddenFeaturesCount }})</span>
    </button>

    <LandingCtaButton
      class="mx-auto mt-6 w-full max-w-[259px] justify-center"
      :class="popular && 'landing-cta--pulse'"
      :href="checkoutHref"
      label="Assinar agora"
      :variant="ctaVariant"
    />
  </article>
</template>
