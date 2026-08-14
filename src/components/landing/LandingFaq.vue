<script setup lang="ts">
import { ref } from 'vue'
import { FAQ_ITEMS, LANDING_SECTIONS } from '@/constants/landing'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'

const openIndex = ref<number | null>(0)
const { isVisible } = useRevealOnScroll()

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section :id="LANDING_SECTIONS.faq" class="bg-transparent px-4 py-20 lg:px-8 lg:py-28">
    <div class="mx-auto max-w-[880px]">
      <LandingSectionHeader
        eyebrow="FAQ"
        title="Dúvidas"
        highlight="frequentes"
        subtitle="Respostas diretas antes de você precisar falar com o suporte."
      />

      <div
        ref="revealRoot"
        class="landing-stagger mt-12 space-y-3"
        :class="isVisible && 'is-visible'"
      >
        <div
          v-for="(item, index) in FAQ_ITEMS"
          :key="item.pergunta"
          class="overflow-hidden rounded-2xl border border-glow-border-soft bg-glow-surface landing-glass-card transition duration-300 hover:border-glow-gold/25"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            :aria-expanded="openIndex === index"
            @click="toggle(index)"
          >
            <span class="font-montserrat text-base font-semibold text-glow-text sm:text-lg">
              {{ item.pergunta }}
            </span>
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-full bg-glow-gold/15 text-glow-gold transition"
              :class="openIndex === index && 'rotate-45'"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14" stroke-linecap="round" />
              </svg>
            </span>
          </button>
          <div
            class="grid transition-[grid-template-rows] duration-300 ease-out"
            :class="openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          >
            <div class="overflow-hidden">
              <p class="px-5 pb-5 font-poppins text-sm font-light leading-relaxed text-glow-text-muted">
                {{ item.resposta }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
