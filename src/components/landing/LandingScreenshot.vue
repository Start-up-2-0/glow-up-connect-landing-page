<script setup lang="ts">
import { computed } from 'vue'
import { SCREENSHOTS, type ScreenshotId } from '@/constants/screenshots'

const props = withDefaults(
  defineProps<{
    id: ScreenshotId
    floating?: boolean
    compact?: boolean
    cinematic?: boolean
    alt?: string
  }>(),
  {
    floating: false,
    compact: false,
    cinematic: false,
  },
)

const asset = computed(() => SCREENSHOTS[props.id])
</script>

<template>
  <div
    class="relative w-full max-w-full min-w-0"
    :class="[
      floating && 'landing-float',
      cinematic && 'landing-screenshot--cinematic',
    ]"
  >
    <div
      class="pointer-events-none absolute inset-x-[8%] inset-y-[12%] -z-10 rounded-[2rem] bg-glow-gold-cta/25 blur-3xl"
      aria-hidden="true"
    />

    <div
      class="relative w-full max-w-full overflow-hidden rounded-2xl border border-glow-border-soft bg-glow-canvas shadow-glow-lg ring-1 ring-glow-border-soft sm:rounded-3xl"
    >
      <div class="flex items-center gap-2 border-b border-glow-border-soft bg-glow-surface px-3 py-2.5 sm:px-4">
        <div class="flex gap-1.5">
          <span class="size-2.5 rounded-full bg-[#995d5f]/80" />
          <span class="size-2.5 rounded-full bg-glow-gold/70" />
          <span class="size-2.5 rounded-full bg-glow-purple-soft/70" />
        </div>
        <div class="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-full bg-glow-hover-surface px-3 py-1">
          <span class="size-1.5 shrink-0 rounded-full bg-emerald-400/80" />
          <span class="truncate font-satoshi text-[10px] text-glow-text-muted sm:text-xs">
            app.glowupconnect.com.br
          </span>
        </div>
      </div>

      <div
        class="bg-glow-canvas"
        :class="compact ? 'max-h-[min(70vh,520px)] overflow-y-auto overflow-x-hidden' : ''"
      >
        <img
          :src="asset.src"
          :alt="alt || asset.alt"
          class="block h-auto w-full max-w-full"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </div>
</template>
