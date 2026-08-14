<script setup lang="ts">
import { computed } from 'vue'
import { useScrollProgress } from '@/composables/motion/useScrollProgress'
import { useMotionPrefs } from '@/composables/motion/useMotionPrefs'

withDefaults(
  defineProps<{
    chapterIndex?: string
    chapterLabel?: string
    /** Mantido por compatibilidade — o tema vem dos tokens glow-* */
    tone?: 'light' | 'dark' | 'canvas'
    showProgress?: boolean
  }>(),
  {
    tone: 'dark',
    showProgress: true,
  },
)

const { progress, eased, inView } = useScrollProgress('progressRoot')
const { reduceMotion, isNarrow } = useMotionPrefs()

const depthStyle = computed(() => {
  if (reduceMotion.value || isNarrow.value) return undefined
  const p = eased.value
  const y = (0.5 - p) * 10
  return {
    transform: `translate3d(0, ${y}px, 0)`,
  }
})
</script>

<template>
  <section
    ref="progressRoot"
    class="landing-story relative overflow-x-clip bg-transparent text-glow-text"
    :data-in-view="inView"
  >
    <div
      v-if="showProgress && !reduceMotion"
      class="pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-[2px] origin-left bg-gradient-to-r from-glow-gold-cta via-glow-purple to-glow-gold-cta opacity-70 md:block"
      :style="{ transform: `scaleX(${progress})` }"
      aria-hidden="true"
    />

    <div class="landing-story__inner relative will-change-transform" :style="depthStyle">
      <div
        v-if="chapterIndex || chapterLabel"
        class="mx-auto hidden max-w-[1280px] items-center gap-3 px-4 pt-10 md:flex lg:px-8 lg:pt-14"
      >
        <span
          v-if="chapterIndex"
          class="font-satoshi text-[11px] font-semibold tracking-[0.22em] text-glow-gold"
        >
          {{ chapterIndex }}
        </span>
        <span
          v-if="chapterLabel"
          class="font-satoshi text-[11px] font-medium uppercase tracking-[0.18em] text-glow-text-muted"
        >
          {{ chapterLabel }}
        </span>
      </div>

      <slot :progress="progress" :eased="eased" :in-view="inView" />
    </div>
  </section>
</template>
