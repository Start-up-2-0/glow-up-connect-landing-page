<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    label?: string
    variant?: 'gold' | 'purple' | 'outline' | 'ghost'
    type?: 'button' | 'submit'
    to?: RouteLocationRaw
    href?: string
    size?: 'md' | 'sm'
  }>(),
  {
    label: 'Começar agora',
    variant: 'gold',
    type: 'button',
    size: 'md',
  },
)

const classes = computed(() => [
  'landing-cta inline-flex w-full items-center justify-center gap-2.5 rounded-[80px] font-montserrat focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-glow-canvas sm:w-auto',
  props.size === 'md' ? 'h-14 px-6 text-base font-medium sm:h-[60px] sm:text-lg' : 'h-11 px-5 text-base font-medium',
  props.variant === 'gold' &&
    'landing-cta--shine bg-glow-gold-cta text-glow-canvas focus:ring-glow-gold-cta/50',
  props.variant === 'purple' &&
    'landing-cta--shine bg-glow-gold-dark text-glow-canvas focus:ring-glow-gold/50',
  props.variant === 'outline' &&
    'border border-glow-border-accent bg-transparent text-glow-text focus:ring-glow-border-accent focus:ring-offset-glow-canvas',
  props.variant === 'ghost' &&
    'border border-glow-border-accent bg-transparent text-glow-text focus:ring-glow-border-accent focus:ring-offset-glow-canvas',
])
</script>

<template>
  <a v-if="href" :href="href" :class="classes" rel="noopener">
    <span>{{ label }}</span>
    <svg
      class="size-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </a>
  <RouterLink v-else-if="to" :to="to" :class="classes">
    <span>{{ label }}</span>
    <svg
      class="size-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </RouterLink>
  <button v-else :type="type" :class="classes">
    <span>{{ label }}</span>
    <svg
      class="size-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>
