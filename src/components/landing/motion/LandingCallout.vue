<script setup lang="ts">
import type { ShotCallout } from '@/constants/showcaseCallouts'

defineProps<{
  callout: ShotCallout
  active?: boolean
  index?: number
}>()
</script>

<template>
  <div
    class="landing-callout pointer-events-none absolute z-20"
    :class="[
      active ? 'landing-callout--active' : 'landing-callout--idle',
      `landing-callout--${callout.side}`,
    ]"
    :style="{
      left: `${callout.x}%`,
      top: `${callout.y}%`,
      transitionDelay: `${(index ?? 0) * 90}ms`,
    }"
  >
    <span class="landing-callout__pulse" aria-hidden="true" />
    <span class="landing-callout__dot" aria-hidden="true" />
    <div class="landing-callout__line" aria-hidden="true" />
    <div class="landing-callout__bubble">
      <p class="font-satoshi text-[10px] font-semibold uppercase tracking-[0.14em] text-glow-gold">
        {{ callout.label }}
      </p>
      <p class="mt-1 max-w-[11rem] font-poppins text-xs leading-snug text-glow-text-muted">
        {{ callout.detail }}
      </p>
    </div>
  </div>
</template>
