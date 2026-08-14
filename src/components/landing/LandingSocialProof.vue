<script setup lang="ts">
import { LANDING_SECTIONS, SOCIAL_STATS, TESTIMONIALS } from '@/constants/landing'
import { STORY_CHAPTERS } from '@/constants/showcaseCallouts'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'

const { isVisible: statsVisible } = useRevealOnScroll('statsRoot')
const { isVisible: quotesVisible } = useRevealOnScroll('quotesRoot')
const chapter = STORY_CHAPTERS.resultados
</script>

<template>
  <LandingStorySection
    :id="LANDING_SECTIONS.provaSocial"
    tone="dark"
    :chapter-index="chapter.index"
    :chapter-label="chapter.label"
  >
    <div class="relative overflow-x-clip px-4 pb-20 pt-4 lg:px-8 lg:pb-28 lg:pt-6">
      <div class="mx-auto max-w-[1280px]">
        <LandingSectionHeader
          eyebrow="Prova social"
          title="Quem já usa"
          highlight="sente a diferença"
          subtitle="Números e depoimentos de quem organiza agenda, caixa e equipe com o Glow Up Connect."
        />

        <div
          ref="statsRoot"
          class="landing-stagger mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          :class="statsVisible && 'is-visible'"
        >
          <div
            v-for="stat in SOCIAL_STATS"
            :key="stat.rotulo"
            class="rounded-3xl border border-glow-border-soft bg-glow-surface p-5 text-center landing-glass-card transition duration-300 hover:-translate-y-1 hover:border-glow-gold/25 hover:bg-glow-hover-surface sm:p-6"
          >
            <p class="landing-stat-pop font-montserrat text-4xl font-black text-glow-gold sm:text-5xl">
              {{ stat.valor }}
            </p>
            <p class="mt-2 font-satoshi text-sm font-semibold text-glow-text">{{ stat.rotulo }}</p>
            <p class="mt-1 font-poppins text-xs font-light text-glow-text-muted">{{ stat.hint }}</p>
          </div>
        </div>

        <div
          ref="quotesRoot"
          class="landing-stagger mt-12 grid gap-5 lg:grid-cols-3"
          :class="quotesVisible && 'is-visible'"
        >
          <blockquote
            v-for="item in TESTIMONIALS"
            :key="item.nome"
            class="flex flex-col rounded-3xl border border-glow-border-soft bg-glow-surface p-5 landing-glass-card transition duration-300 hover:-translate-y-1 hover:bg-glow-hover-surface sm:p-6"
          >
            <div class="flex gap-0.5 text-glow-gold" aria-label="Avaliação 5 estrelas">
              <svg
                v-for="n in item.rating"
                :key="n"
                class="size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l2.9 6.9H22l-5.5 4.5 2.1 6.6L12 16.9 5.4 20l2.1-6.6L2 8.9h7.1L12 2z" />
              </svg>
            </div>
            <p class="mt-4 flex-1 font-poppins text-sm font-light leading-relaxed text-glow-text-subtle">
              “{{ item.quote }}”
            </p>
            <footer class="mt-6 border-t border-glow-border-soft pt-4">
              <p class="font-montserrat text-sm font-semibold text-glow-text">{{ item.nome }}</p>
              <p class="font-satoshi text-xs text-glow-text-muted">
                {{ item.cargo }} · {{ item.estabelecimento }}
              </p>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
