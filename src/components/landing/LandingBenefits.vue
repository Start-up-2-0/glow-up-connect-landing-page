<script setup lang="ts">
import { BUSINESS_BENEFITS, LANDING_SECTIONS } from '@/constants/landing'
import { STORY_CHAPTERS } from '@/constants/showcaseCallouts'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import LandingFeatureIcon from '@/components/landing/LandingFeatureIcon.vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'

const { isVisible } = useRevealOnScroll()
const chapter = STORY_CHAPTERS.beneficios
</script>

<template>
  <LandingStorySection
    :id="LANDING_SECTIONS.beneficios"
    tone="dark"
    :chapter-index="chapter.index"
    :chapter-label="chapter.label"
  >
    <div class="px-4 pb-20 pt-4 lg:px-8 lg:pb-28 lg:pt-6">
      <div class="mx-auto max-w-[1280px]">
        <LandingSectionHeader
          tone="dark"
          eyebrow="Benefícios para o negócio"
          title="Resultados que aparecem"
          highlight="na operação"
          subtitle="Menos furos na agenda, caixa mais previsível e cliente melhor atendido — impacto que você sente no dia a dia."
        />

        <div
          ref="revealRoot"
          class="landing-stagger mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          :class="isVisible && 'is-visible'"
        >
          <article
            v-for="benefit in BUSINESS_BENEFITS"
            :key="benefit.titulo"
            class="group rounded-3xl border border-glow-border-soft bg-glow-surface p-5 landing-glass-card transition duration-300 hover:-translate-y-1 hover:border-glow-gold/30 hover:bg-glow-hover-surface sm:p-6"
          >
            <div
              class="landing-icon-pop flex size-11 items-center justify-center rounded-xl bg-glow-gold/15 text-glow-gold"
            >
              <LandingFeatureIcon :name="benefit.icon" />
            </div>
            <h3 class="mt-5 font-montserrat text-lg font-semibold text-glow-text">
              {{ benefit.titulo }}
            </h3>
            <p class="mt-2 font-poppins text-sm font-light leading-relaxed text-glow-text-muted">
              {{ benefit.descricao }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
