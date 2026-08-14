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
      class="max-w-full break-words font-montserrat text-[1.625rem] font-light leading-[1.3] text-balance text-glow-text sm:text-4xl sm:leading-[1.2] lg:text-5xl xl:text-[3.5rem] xl:leading-[1.12]"
    >
      <span>{{ title }}</span>
      <span v-if="highlight" class="font-black text-glow-gold">
        {{ ' ' + highlight }}
      </span>
      <span v-if="titleAfter">{{ ' ' + titleAfter }}</span>
    </h2>

    <p
      v-if="subtitle"
      class="mt-4 font-poppins text-[0.9375rem] font-light leading-relaxed text-glow-text-subtle sm:mt-5 sm:text-lg"
      :class="align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-xl'"
    >
      {{ subtitle }}
    </p>
  </div>
</template>
