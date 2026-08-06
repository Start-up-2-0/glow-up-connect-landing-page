<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  LANDING_SECTIONS,
  SHOWCASE_INTRO,
  SHOWCASE_ITEMS,
} from '@/constants/landing'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import LandingShotStage from '@/components/landing/motion/LandingShotStage.vue'

const activeId = ref(SHOWCASE_ITEMS[0].id)
const { isVisible } = useRevealOnScroll()

const active = computed(
  () => SHOWCASE_ITEMS.find((item) => item.id === activeId.value) ?? SHOWCASE_ITEMS[0],
)

const activeIndex = computed(() =>
  SHOWCASE_ITEMS.findIndex((item) => item.id === activeId.value),
)

function select(id: string) {
  activeId.value = id
}

function goPrev() {
  const i = activeIndex.value
  activeId.value = SHOWCASE_ITEMS[i <= 0 ? SHOWCASE_ITEMS.length - 1 : i - 1].id
}

function goNext() {
  const i = activeIndex.value
  activeId.value = SHOWCASE_ITEMS[i >= SHOWCASE_ITEMS.length - 1 ? 0 : i + 1].id
}
</script>

<template>
  <LandingStorySection
    :id="LANDING_SECTIONS.plataforma"
    tone="dark"
    :show-progress="false"
  >
    <div class="relative px-4 pb-16 pt-6 lg:px-8 lg:pb-24 lg:pt-10">
      <div
        class="pointer-events-none absolute left-1/2 top-10 h-56 w-[min(100%,28rem)] -translate-x-1/2 rounded-full bg-glow-gold/15 blur-[100px]"
        aria-hidden="true"
      />

      <div class="relative mx-auto w-full max-w-[1120px] min-w-0">
        <LandingSectionHeader
          tone="dark"
          :eyebrow="SHOWCASE_INTRO.eyebrow"
          :title="SHOWCASE_INTRO.titulo"
          :highlight="SHOWCASE_INTRO.destaque"
          :subtitle="SHOWCASE_INTRO.subtitulo"
        />

        <div
          ref="revealRoot"
          class="landing-reveal mt-10 min-w-0"
          :class="isVisible && 'is-visible'"
        >
          <div class="relative min-w-0">
            <div
              class="landing-tab-scroller flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Telas da plataforma"
            >
              <button
                v-for="item in SHOWCASE_ITEMS"
                :key="item.id"
                type="button"
                role="tab"
                :aria-selected="active.id === item.id"
                class="landing-tab shrink-0 rounded-full px-3.5 py-2 font-satoshi text-sm sm:px-4"
                :class="
                  active.id === item.id
                    ? 'bg-white font-semibold text-glow-inverse-surface shadow-glow-sm'
                    : 'bg-white/10 font-medium text-white/65 hover:bg-white/15 hover:text-white'
                "
                @click="select(item.id)"
              >
                {{ item.titulo }}
              </button>
            </div>
          </div>

          <div class="mt-5 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <Transition
              mode="out-in"
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <p
                :key="active.id"
                class="min-w-0 max-w-2xl font-poppins text-sm font-light leading-relaxed text-white/60 sm:text-base"
              >
                {{ active.beneficio }}
              </p>
            </Transition>
            <div class="flex shrink-0 items-center gap-2">
              <span class="font-satoshi text-xs text-white/40">
                {{ String(activeIndex + 1).padStart(2, '0') }}
                /
                {{ String(SHOWCASE_ITEMS.length).padStart(2, '0') }}
              </span>
              <button
                type="button"
                class="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:-translate-y-0.5 hover:border-glow-gold/40"
                aria-label="Tela anterior"
                @click="goPrev"
              >
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                class="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:-translate-y-0.5 hover:border-glow-gold/40"
                aria-label="Próxima tela"
                @click="goNext"
              >
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div class="mt-8 w-full min-w-0 max-w-full">
            <Transition
              mode="out-in"
              enter-active-class="transition duration-500 ease-out"
              enter-from-class="opacity-0 translate-y-4 scale-[0.98]"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0 translate-y-2"
            >
              <LandingShotStage
                :key="active.id"
                :screenshot-id="active.mockup"
                :callout-key="active.id"
                show-callouts
                tilt
              />
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
