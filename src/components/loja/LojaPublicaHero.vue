<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import type { EstabelecimentoPublico } from '@/types/estabelecimento.types'
import { lojaAgendarPath, ROUTE_PATHS } from '@/constants/routes'
import { formatDistanciaKm } from '@/utils/formatters'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'

defineProps<{
  loja: EstabelecimentoPublico
  enderecoResumo: string | null
}>()

const { isVisible } = useRevealOnScroll()
</script>

<template>
  <header class="relative overflow-hidden pt-24 sm:pt-28">
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-br from-glow-surface via-glow-canvas to-glow-bg-elevated"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-glow-gold/20 blur-[100px]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-glow-purple/40 blur-[90px]"
      aria-hidden="true"
    />
    <div class="absolute inset-0 landing-grain opacity-[0.05] mix-blend-overlay" aria-hidden="true" />

    <div class="relative mx-auto max-w-[1280px] px-4 pb-14 lg:px-8 lg:pb-20">
      <RouterLink
        :to="ROUTE_PATHS.EXPLORAR_LOJAS"
        class="mb-8 inline-flex font-satoshi text-sm font-semibold text-glow-text-muted transition hover:text-glow-text"
      >
        ← Voltar ao mapa
      </RouterLink>

      <div
        ref="revealRoot"
        class="landing-reveal grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-12"
        :class="isVisible && 'is-visible'"
      >
        <div
          class="mx-auto flex size-32 items-center justify-center overflow-hidden rounded-[1.75rem] border border-glow-gold/40 bg-glow-avatar-bg shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] sm:size-40 md:mx-0"
        >
          <img
            v-if="loja.logo"
            :src="loja.logo"
            :alt="`Logo de ${loja.nome}`"
            class="size-full object-contain p-4"
            width="160"
            height="160"
            decoding="async"
          />
          <span
            v-else
            class="font-montserrat text-4xl font-black text-glow-gold"
            aria-hidden="true"
          >
            {{ loja.nome.charAt(0) }}
          </span>
        </div>

        <div>
          <p
            v-if="loja.categoria"
            class="font-satoshi text-xs font-semibold uppercase tracking-[0.22em] text-glow-gold"
          >
            {{ loja.categoria }}
          </p>
          <h1 class="mt-3 font-montserrat text-3xl font-light leading-[1.15] text-glow-text sm:text-4xl lg:text-5xl">
            <span class="font-black">{{ loja.nome }}</span>
          </h1>

          <div class="mt-5 flex flex-wrap gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-glow-border-soft bg-glow-surface px-3 py-1.5 font-satoshi text-xs font-semibold text-glow-text-soft"
            >
              <span class="text-glow-gold" aria-hidden="true">★</span>
              <template v-if="(loja.notaMedia ?? 0) > 0">
                {{ loja.notaMedia!.toFixed(1).replace('.', ',') }}
                <span class="font-normal text-glow-text-muted">({{ loja.totalAvaliacoes ?? 0 }})</span>
              </template>
              <template v-else>Sem avaliações</template>
            </span>

            <span
              v-if="loja.distanciaKm != null"
              class="rounded-full border border-glow-border-soft bg-glow-surface px-3 py-1.5 font-satoshi text-xs font-semibold text-glow-text-muted"
            >
              {{ formatDistanciaKm(loja.distanciaKm) }}
            </span>

            <span
              v-if="loja.abertoAgora != null"
              class="rounded-full border px-3 py-1.5 font-satoshi text-xs font-semibold"
              :class="
                loja.abertoAgora
                  ? 'border-glow-success/35 text-glow-success'
                  : 'border-glow-border-soft text-glow-text-muted'
              "
            >
              {{ loja.abertoAgora ? 'Aberto agora' : 'Fechado agora' }}
              <template v-if="loja.horarioAbertura && loja.horarioFechamento">
                · {{ loja.horarioAbertura }}–{{ loja.horarioFechamento }}
              </template>
            </span>
          </div>

          <p
            v-if="enderecoResumo"
            class="mt-5 max-w-xl font-poppins text-sm font-light leading-relaxed text-glow-text-muted sm:text-base"
          >
            {{ enderecoResumo }}
          </p>

          <div class="mt-8">
            <LandingCtaButton
              label="Agendar agora"
              variant="gold"
              class="landing-cta--pulse shadow-[0_0_36px_rgba(146,103,155,0.35)]"
              :to="lojaAgendarPath(loja.publicGuid)"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
