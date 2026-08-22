<script setup lang="ts">
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'

withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    highlight?: string
    titleAfter?: string
    subtitle?: string
    align?: 'left' | 'center'
    tone?: 'light' | 'dark'
  }>(),
  {
    align: 'center',
    tone: 'dark',
  },
)

const { isVisible } = useRevealOnScroll()
</script>

<template>
  <div
    ref="revealRoot"
    class="landing-reveal max-w-3xl"
    :class="[
      align === 'center' ? 'mx-auto text-center' : 'text-left',
      isVisible && 'is-visible',
    ]"
  >
    <p
      v-if="eyebrow"
      class="mb-4 font-satoshi text-xs font-semibold uppercase tracking-[0.22em] text-glow-gold"
    >
      {{ eyebrow }}
    </p>

    <h2
      class="max-w-full break-words font-montserrat text-[1.5rem] font-medium leading-[1.3] text-balance text-glow-text sm:text-[2.125rem] sm:leading-[1.2] lg:text-4xl xl:text-[2.75rem] xl:leading-[1.15]"
    >
      <span>{{ title }}</span>
      <span v-if="highlight" class="font-black text-glow-gold">
        {{ ' ' + highlight }}
      </span>
      <span v-if="titleAfter">{{ ' ' + titleAfter }}</span>
    </h2>

    <p
      v-if="subtitle"
      class="mt-3 font-poppins text-sm leading-relaxed text-glow-text-muted sm:mt-4 sm:text-base sm:leading-relaxed"
      :class="align === 'center' ? 'mx-auto max-w-xl' : 'max-w-lg'"
    >
      {{ subtitle }}
    </p>
  </div>
</template>
