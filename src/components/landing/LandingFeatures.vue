<script setup lang="ts">
import { FEATURES, LANDING_SECTIONS } from '@/constants/landing'
import { STORY_CHAPTERS } from '@/constants/showcaseCallouts'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import LandingFeatureIcon from '@/components/landing/LandingFeatureIcon.vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'

const { isVisible } = useRevealOnScroll()
const chapter = STORY_CHAPTERS.funcionalidades
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
          title="Tudo que sua"
          highlight="barbearia ou salão"
          title-after="precisa"
          subtitle="Agenda, clientes, equipe e financeiro no mesmo lugar — recursos que resolvem a rotina, não só preenchem uma lista."
        />

        <div
          ref="revealRoot"
          class="landing-stagger mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          :class="isVisible && 'is-visible'"
        >
          <article
            v-for="feature in FEATURES"
            :key="feature.titulo"
            class="group rounded-3xl border border-white/15 bg-white/[0.06] p-5 landing-glass-card transition duration-300 hover:-translate-y-1 hover:border-glow-gold/30 hover:bg-white/[0.08] sm:p-6"
          >
            <div
              class="landing-icon-pop flex size-12 items-center justify-center rounded-2xl bg-glow-gold/15 text-glow-gold transition group-hover:bg-glow-gold-cta group-hover:text-white"
            >
              <LandingFeatureIcon :name="feature.icon" />
            </div>
            <h3 class="mt-5 font-montserrat text-lg font-semibold text-white">
              {{ feature.titulo }}
            </h3>
            <p class="mt-2 font-poppins text-sm font-light leading-relaxed text-white/60">
              {{ feature.descricao }}
            </p>
            <p class="mt-4 border-t border-white/10 pt-4 font-satoshi text-xs font-semibold text-glow-gold">
              {{ feature.beneficio }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
