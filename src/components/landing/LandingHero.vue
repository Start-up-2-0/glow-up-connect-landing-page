<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { HERO_COPY, LANDING_SECTIONS } from '@/constants/landing'
import { FEATURE_FLAGS } from '@/config/features'
import { APP_URL } from '@/constants/urls'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { useHeroParallax } from '@/composables/useHeroParallax'
import LandingScreenshot from '@/components/landing/LandingScreenshot.vue'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'

const { goToSection } = useLandingScroll()
const heroSection = useTemplateRef<HTMLElement>('heroSection')
const {
  bind,
  onMouseMove,
  onMouseLeave,
  layerBg,
  layerVisual,
  layerCardPrimary,
  layerCardSecondary,
} = useHeroParallax()

onMounted(() => bind(heroSection.value))

const subtitulo = FEATURE_FLAGS.lojasHabilitadas
  ? HERO_COPY.subtitulo
  : 'A Glow ajuda barbeiros e cabeleireiros autônomos a organizar horários, acompanhar o caixa e receber agendamentos online — sem depender só do WhatsApp.'
const audiencia = FEATURE_FLAGS.lojasHabilitadas
  ? HERO_COPY.audiencia
  : (['Barbeiros', 'Cabeleireiros(as)'] as const)
const portes = FEATURE_FLAGS.lojasHabilitadas ? HERO_COPY.portes : HERO_COPY.portes.slice(0, 1)
</script>

<template>
  <section
    ref="heroSection"
    :id="LANDING_SECTIONS.inicio"
    class="landing-hero-arc relative overflow-x-clip bg-transparent pt-28 pb-20 sm:pt-32 lg:pb-28 lg:pt-36"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div
      class="pointer-events-none absolute inset-0 will-change-transform"
      aria-hidden="true"
      :style="layerBg"
    >
      <div
        class="absolute -left-24 top-20 h-[420px] w-[420px] rounded-full bg-glow-gold-cta/25 blur-[120px] landing-float"
      />
      <div
        class="absolute -right-16 bottom-0 h-[380px] w-[380px] rounded-full bg-glow-gold/15 blur-[110px] landing-float"
        style="animation-duration: 8s; animation-delay: -2s"
      />
      <div
        class="absolute left-1/2 top-1/3 h-64 w-[60%] -translate-x-1/2 rounded-full bg-glow-primary/10 blur-[100px]"
      />
      <div class="absolute inset-0 landing-grain opacity-[0.07] mix-blend-overlay" />
      <div
        class="absolute inset-0 opacity-[0.35]"
        style="
          background-image: linear-gradient(color-mix(in srgb, var(--glow-gold) 12%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--glow-gold) 12%, transparent) 1px, transparent 1px);
          background-size: 64px 64px;
        "
      />
    </div>

    <div class="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-8">
      <div class="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-16">
        <div class="max-w-xl lg:max-w-none">
          <p
            class="hero-enter hero-enter-d1 inline-flex items-center gap-2 rounded-full border border-glow-gold/30 bg-glow-gold/10 px-3.5 py-1.5 font-satoshi text-[11px] font-semibold uppercase tracking-[0.18em] text-glow-gold"
          >
            <span class="size-1.5 animate-pulse rounded-full bg-glow-gold" />
            {{ HERO_COPY.eyebrow }}
          </p>

          <h1
            class="hero-enter hero-enter-d2 mt-6 font-montserrat text-[1.875rem] font-medium leading-snug text-glow-text sm:text-5xl sm:leading-[1.08] xl:text-[3.5rem]"
          >
            <span class="block">{{ HERO_COPY.tituloLinha1 }}</span>
            <span class="block font-black text-glow-gold">{{ HERO_COPY.tituloDestaque }}</span>
            <span v-if="HERO_COPY.tituloLinha2" class="block">{{ HERO_COPY.tituloLinha2 }}</span>
          </h1>

          <p
            class="hero-enter hero-enter-d3 mt-5 max-w-lg font-poppins text-[0.9375rem] leading-relaxed text-glow-text-muted sm:mt-6 sm:text-lg"
          >
            {{ subtitulo }}
          </p>

          <ul
            class="hero-enter hero-enter-d3 mt-5 flex flex-wrap gap-2"
            aria-label="Público atendido"
          >
            <li
              v-for="publico in audiencia"
              :key="publico"
              class="rounded-full border border-glow-gold/30 bg-glow-gold/10 px-3 py-1 font-satoshi text-[11px] font-semibold uppercase tracking-[0.12em] text-glow-gold"
            >
              {{ publico }}
            </li>
          </ul>

          <div class="hero-enter hero-enter-d4 mt-9 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <a :href="`${APP_URL}/auth/register`" class="w-full sm:w-auto">
              <LandingCtaButton :label="HERO_COPY.ctaPrimario" class="w-full justify-center sm:w-auto" />
            </a>
            <button type="button" class="w-full sm:w-auto" @click="goToSection(LANDING_SECTIONS.plataforma)">
              <LandingCtaButton
                :label="HERO_COPY.ctaSecundario"
                variant="ghost"
                class="w-full justify-center sm:w-auto"
              />
            </button>
          </div>

          <dl
            class="hero-enter hero-enter-d5 mt-10 grid grid-cols-3 gap-2 border-t border-glow-border-soft pt-8 sm:max-w-md sm:gap-4"
          >
            <div v-for="porte in portes" :key="porte.dt">
              <dt class="font-satoshi text-[10px] uppercase tracking-wider text-glow-text-muted">
                {{ porte.dt }}
              </dt>
              <dd class="mt-1 font-montserrat text-sm font-semibold text-glow-text">{{ porte.dd }}</dd>
            </div>
          </dl>
        </div>

        <div
          class="relative mx-auto w-full max-w-xl pb-10 pt-4 will-change-transform lg:mx-0 lg:max-w-none lg:pb-8 lg:pt-6"
          :style="layerVisual"
        >
          <div class="hero-enter-scale hero-enter-d6">
            <LandingScreenshot id="dashboard" floating />
          </div>

          <div
            class="pointer-events-none absolute -bottom-1 left-0 z-20 hidden will-change-transform sm:block lg:-bottom-2 lg:-left-5"
            :style="layerCardSecondary"
          >
            <aside
              class="hero-float-card hero-float-card--delay pointer-events-auto"
              aria-label="Agenda do dia organizada"
            >
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-glow-gold-cta/20 text-glow-gold"
                aria-hidden="true"
              >
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round" />
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h5" stroke-linecap="round" />
                </svg>
              </span>
              <div class="min-w-0">
                <p class="font-satoshi text-[10px] font-medium uppercase tracking-[0.14em] text-glow-text-muted">
                  Agenda do dia
                </p>
                <p class="mt-0.5 font-montserrat text-base font-bold leading-none text-glow-text">
                  Horários organizados
                </p>
              </div>
            </aside>
          </div>

          <div
            class="pointer-events-none absolute -right-1 top-2 z-20 hidden will-change-transform md:block lg:-right-4 lg:top-6"
            :style="layerCardPrimary"
          >
            <aside
              class="hero-float-card pointer-events-auto"
              aria-label="Financeiro do negócio sob controle"
            >
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-glow-success-bg text-glow-success"
                aria-hidden="true"
              >
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" />
                </svg>
              </span>
              <div class="min-w-0">
                <p class="font-satoshi text-[10px] font-medium uppercase tracking-[0.14em] text-glow-text-muted">
                  Financeiro
                </p>
                <p class="mt-0.5 font-montserrat text-base font-bold leading-none text-glow-text">
                  Caixa sob controle
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
