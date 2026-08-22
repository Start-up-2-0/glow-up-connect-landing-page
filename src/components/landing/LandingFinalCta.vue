<script setup lang="ts">
import { FINAL_CTA, LANDING_SECTIONS } from '@/constants/landing'
import { FEATURE_FLAGS } from '@/config/features'
import { STORY_CHAPTERS } from '@/constants/showcaseCallouts'
import { APP_URL } from '@/constants/urls'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'

const { goToSection } = useLandingScroll()
const { isVisible } = useRevealOnScroll()
const chapter = STORY_CHAPTERS.cta
const subtitulo = FEATURE_FLAGS.lojasHabilitadas
  ? FINAL_CTA.subtitulo
  : 'Crie sua conta, cadastre serviços e horários e comece a atender com agenda e caixa no mesmo sistema.'
</script>

<template>
  <LandingStorySection
    tone="dark"
    :chapter-index="chapter.index"
    :chapter-label="chapter.label"
    :show-progress="false"
  >
    <div class="relative overflow-hidden px-4 pb-20 pt-6 lg:px-8 lg:pb-28 lg:pt-10">
      <div
        class="absolute inset-0 bg-gradient-to-br from-glow-canvas via-glow-surface to-glow-bg-elevated"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-glow-gold/25 blur-[100px]"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-glow-gold-cta/30 blur-[90px]"
        aria-hidden="true"
      />
      <div class="absolute inset-0 landing-grain opacity-[0.06] mix-blend-overlay" aria-hidden="true" />

      <div
        ref="revealRoot"
        class="landing-reveal relative mx-auto max-w-3xl text-center"
        :class="isVisible && 'is-visible'"
      >
        <h2 class="font-montserrat text-[1.75rem] font-medium leading-[1.2] text-glow-text sm:text-4xl lg:text-[2.75rem]">
          {{ FINAL_CTA.titulo }}
          <span class="font-black text-glow-gold"> {{ FINAL_CTA.destaque }}</span>
        </h2>
        <p class="mx-auto mt-4 max-w-lg font-poppins text-sm leading-relaxed text-glow-text-muted sm:mt-5 sm:text-base">
          {{ subtitulo }}
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a :href="`${APP_URL}/auth/register`">
            <LandingCtaButton
              :label="FINAL_CTA.cta"
              class="landing-cta--pulse !h-14 !px-8 !text-lg shadow-[0_0_40px_rgba(146,103,155,0.45)]"
            />
          </a>
          <button type="button" @click="goToSection(LANDING_SECTIONS.planos)">
            <LandingCtaButton :label="FINAL_CTA.secondary" variant="ghost" />
          </button>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
