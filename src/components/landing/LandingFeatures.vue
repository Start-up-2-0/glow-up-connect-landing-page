<script setup lang="ts">
import { computed } from 'vue'
import { FEATURES, LANDING_SECTIONS } from '@/constants/landing'
import { FEATURE_FLAGS } from '@/config/features'
import { semItensDeLoja } from '@/utils/tipoAssinatura'
import { STORY_CHAPTERS } from '@/constants/showcaseCallouts'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import LandingFeatureIcon from '@/components/landing/LandingFeatureIcon.vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'

const { isVisible } = useRevealOnScroll()
const chapter = STORY_CHAPTERS.funcionalidades
const featureItems = computed(() => semItensDeLoja(FEATURES))
const subtitle = FEATURE_FLAGS.lojasHabilitadas
  ? 'Para barbeiros e cabeleireiros autônomos — e para barbearias e salões pequenos, médios e grandes. Recursos que resolvem a rotina, não só preenchem uma lista.'
  : 'Para barbeiros e cabeleireiros autônomos. Recursos que resolvem a rotina, não só preenchem uma lista.'
</script>

<template>
  <LandingStorySection
    :id="LANDING_SECTIONS.funcionalidades"
    tone="dark"
    :chapter-index="chapter.index"
    :chapter-label="chapter.label"
  >
    <div class="relative overflow-x-clip px-4 pb-20 pt-4 lg:px-8 lg:pb-28 lg:pt-6">
      <div class="mx-auto max-w-[1280px]">
        <LandingSectionHeader
          eyebrow="Funcionalidades"
          title="Tudo que o seu"
          highlight="atendimento"
          title-after="precisa"
          :subtitle="subtitle"
        />

        <div
          ref="revealRoot"
          class="landing-stagger mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          :class="isVisible && 'is-visible'"
        >
          <article
            v-for="feature in featureItems"
            :key="feature.titulo"
            class="group rounded-3xl border border-glow-border-soft bg-glow-surface p-5 landing-glass-card transition duration-300 hover:-translate-y-1 hover:border-glow-gold/30 hover:bg-glow-hover-surface sm:p-6"
          >
            <div
              class="landing-icon-pop flex size-12 items-center justify-center rounded-2xl bg-glow-gold/15 text-glow-gold transition group-hover:bg-glow-gold-cta group-hover:text-glow-canvas"
            >
              <LandingFeatureIcon :name="feature.icon" />
            </div>
            <h3 class="mt-5 font-montserrat text-lg font-semibold text-glow-text">
              {{ feature.titulo }}
            </h3>
            <p class="mt-2 font-poppins text-sm font-light leading-relaxed text-glow-text-muted">
              {{ feature.descricao }}
            </p>
            <p class="mt-4 border-t border-glow-border-soft pt-4 font-satoshi text-xs font-semibold text-glow-gold">
              {{ feature.beneficio }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
