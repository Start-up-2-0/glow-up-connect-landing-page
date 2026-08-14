<script setup lang="ts">
import { VISUAL_DEMO_SCREENSHOTS } from '@/constants/screenshots'
import { STORY_CHAPTERS } from '@/constants/showcaseCallouts'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import LandingShotStage from '@/components/landing/motion/LandingShotStage.vue'

const { isVisible } = useRevealOnScroll()
const chapter = STORY_CHAPTERS.demonstracao
</script>

<template>
  <LandingStorySection
    tone="dark"
    :chapter-index="chapter.index"
    :chapter-label="chapter.label"
  >
    <div class="px-4 pb-20 pt-4 lg:px-8 lg:pb-28 lg:pt-6">
      <div class="mx-auto max-w-[1280px]">
        <LandingSectionHeader
          eyebrow="Demonstração visual"
          title="A mesma interface"
          highlight="do dia a dia"
          subtitle="Capturas reais do Glow Up Connect — o que sua equipe vê ao abrir o app, com dados de demonstração."
        />

        <div
          ref="revealRoot"
          class="mt-16 space-y-16 lg:space-y-32"
          :class="isVisible && 'is-visible'"
        >
          <div
            v-for="(demo, index) in VISUAL_DEMO_SCREENSHOTS"
            :key="demo.id"
            class="landing-reveal grid items-center gap-6 lg:grid-cols-2 lg:gap-16"
            :class="[
              isVisible && 'is-visible',
              index === 1 && 'landing-reveal-delay-1',
              index === 2 && 'landing-reveal-delay-2',
            ]"
          >
            <div :class="index % 2 === 1 ? 'lg:order-2' : ''">
              <p class="font-satoshi text-xs font-semibold uppercase tracking-[0.2em] text-glow-gold">
                {{ String(index + 1).padStart(2, '0') }} · {{ demo.titulo }}
              </p>
              <h3 class="mt-3 font-montserrat text-2xl font-semibold leading-snug text-glow-text sm:text-3xl">
                {{ demo.beneficio }}
              </h3>
              <p class="mt-4 max-w-md font-poppins text-base font-light leading-relaxed text-glow-text-muted">
                Interface pensada para barbearias e salões: clara no celular da recepção e
                completa no computador da gestão.
              </p>
            </div>
            <div :class="index % 2 === 1 ? 'lg:order-1' : ''" class="min-w-0 max-w-full">
              <LandingShotStage
                :screenshot-id="demo.screenshot"
                :callout-key="demo.screenshot"
                :tilt="index % 2 === 0"
                show-callouts
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
