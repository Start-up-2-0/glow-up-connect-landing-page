<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { HERO_COPY, LANDING_SECTIONS } from '@/constants/landing'
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
        class="absolute -right-16 bottom-0 h-[380px] w-[380px] rounded-full bg-glow-purple/40 blur-[110px] landing-float"
        style="animation-duration: 8s; animation-delay: -2s"
      />
      <div
        class="absolute left-1/2 top-1/3 h-64 w-[60%] -translate-x-1/2 rounded-full bg-glow-primary/10 blur-[100px]"
      />
      <div class="absolute inset-0 landing-grain opacity-[0.07] mix-blend-overlay" />
      <div
        class="absolute inset-0 opacity-[0.35]"
        style="
          background-image: linear-gradient(rgba(207, 176, 218, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(207, 176, 218, 0.06) 1px, transparent 1px);
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
            class="hero-enter hero-enter-d2 mt-6 font-montserrat text-[2rem] font-light leading-snug text-white sm:text-5xl sm:leading-[1.08] xl:text-[3.75rem]"
          >
            <span class="block">{{ HERO_COPY.tituloLinha1 }}</span>
            <span class="block font-black text-glow-gold">{{ HERO_COPY.tituloDestaque }}</span>
            <span class="block">{{ HERO_COPY.tituloLinha2 }}</span>
          </h1>

          <p
            class="hero-enter hero-enter-d3 mt-6 max-w-lg font-poppins text-base font-light leading-relaxed text-white/70 sm:text-lg"
          >
            {{ HERO_COPY.subtitulo }}
          </p>

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
            class="hero-enter hero-enter-d5 mt-10 grid grid-cols-3 gap-2 border-t border-white/10 pt-8 sm:max-w-md sm:gap-4"
          >
            <div>
              <dt class="font-satoshi text-[10px] uppercase tracking-wider text-white/45">Foco</dt>
              <dd class="mt-1 font-montserrat text-sm font-semibold text-white">Beleza</dd>
            </div>
            <div>
              <dt class="font-satoshi text-[10px] uppercase tracking-wider text-white/45">Operação</dt>
              <dd class="mt-1 font-montserrat text-sm font-semibold text-white">Completa</dd>
            </div>
            <div>
              <dt class="font-satoshi text-[10px] uppercase tracking-wider text-white/45">Setup</dt>
              <dd class="mt-1 font-montserrat text-sm font-semibold text-white">Minutos</dd>
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
              aria-label="Agenda de hoje: 5 atendimentos"
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
                <p class="font-satoshi text-[10px] font-medium uppercase tracking-[0.14em] text-white/50">
                  Agenda de hoje
                </p>
                <p class="mt-0.5 font-montserrat text-base font-bold leading-none text-white">
                  5 atendimentos
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
              aria-label="Receita no mês: R$ 13,2 mil"
            >
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300"
                aria-hidden="true"
              >
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" />
                </svg>
              </span>
              <div class="min-w-0">
                <p class="font-satoshi text-[10px] font-medium uppercase tracking-[0.14em] text-white/50">
                  Receita no mês
                </p>
                <p class="mt-0.5 flex items-baseline gap-1.5 font-montserrat text-base font-bold leading-none text-glow-gold">
                  R$ 13,2k
                  <span class="font-satoshi text-[10px] font-semibold text-emerald-300">+18%</span>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
