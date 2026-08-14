<script setup lang="ts">
import { computed } from 'vue'
import type { ScreenshotId } from '@/constants/screenshots'
import { SHOWCASE_CALLOUTS } from '@/constants/showcaseCallouts'
import { useMotionPrefs } from '@/composables/motion/useMotionPrefs'
import { useScrollProgress } from '@/composables/motion/useScrollProgress'
import LandingScreenshot from '@/components/landing/LandingScreenshot.vue'
import LandingCallout from '@/components/landing/motion/LandingCallout.vue'

const props = withDefaults(
  defineProps<{
    screenshotId: ScreenshotId
    calloutKey?: string
    floating?: boolean
    compact?: boolean
    tilt?: boolean
    showCallouts?: boolean
  }>(),
  {
    floating: false,
    compact: false,
    tilt: true,
    showCallouts: true,
  },
)

const { eased, inView } = useScrollProgress('stageRoot')
const { reduceMotion, isNarrow, isCoarsePointer } = useMotionPrefs()

const callouts = computed(() => {
  const key = props.calloutKey ?? props.screenshotId
  return SHOWCASE_CALLOUTS[key] ?? []
})

const showOverlayCallouts = computed(
  () =>
    props.showCallouts &&
    callouts.value.length > 0 &&
    !isNarrow.value &&
    !reduceMotion.value,
)

const calloutsActive = computed(() => inView.value && eased.value > 0.22)

const stageStyle = computed(() => {
  if (reduceMotion.value || isNarrow.value || !props.tilt) return undefined
  const p = eased.value
  const scale = 0.94 + Math.min(1, p * 2.2) * 0.06
  const rotateY = (0.5 - p) * (isCoarsePointer.value ? 2 : 4)
  const rotateX = (p - 0.45) * 2.5
  const y = (1 - Math.min(1, p * 1.8)) * 36
  return {
    transform: `perspective(1200px) translate3d(0, ${y}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
    opacity: 0.35 + Math.min(1, p * 2.5) * 0.65,
  }
})

const spotlightStyle = computed(() => {
  if (reduceMotion.value || isNarrow.value) return undefined
  const p = eased.value
  return {
    opacity: Math.min(1, Math.max(0, (p - 0.15) * 2)),
  }
})

const mobileCallouts = computed(() => false)
</script>

<template>
  <div ref="stageRoot" class="landing-shot-stage relative w-full min-w-0 max-w-full">
    <div class="landing-shot-stage__frame will-change-transform" :style="stageStyle">
      <div class="relative">
        <LandingScreenshot
          :id="screenshotId"
          :floating="floating"
          :compact="compact"
          cinematic
        />

        <div
          class="landing-shot-stage__spotlight pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl"
          :style="spotlightStyle"
          aria-hidden="true"
        />

        <!-- Callouts só sobre a imagem (abaixo do chrome do browser mock) -->
        <div
          v-if="showOverlayCallouts"
          class="landing-shot-stage__hotspots pointer-events-none absolute inset-x-0 bottom-0 top-[2.65rem] sm:top-[2.85rem]"
          aria-hidden="true"
        >
          <LandingCallout
            v-for="(item, index) in callouts"
            :key="item.id"
            :callout="item"
            :index="index"
            :active="calloutsActive"
          />
        </div>
      </div>
    </div>

    <ul v-if="mobileCallouts" class="mt-5 space-y-2 sm:hidden">
      <li
        v-for="item in callouts"
        :key="item.id"
        class="rounded-2xl border border-glow-border-soft bg-glow-surface px-4 py-3"
      >
        <p class="font-satoshi text-[10px] font-semibold uppercase tracking-[0.14em] text-glow-gold">
          {{ item.label }}
        </p>
        <p class="mt-1 font-poppins text-sm font-light text-glow-text-muted">
          {{ item.detail }}
        </p>
      </li>
    </ul>
  </div>
</template>
