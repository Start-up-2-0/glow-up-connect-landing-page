<script setup lang="ts">
import { AGENDAR_BTN_OUTLINE_CLASS, AGENDAR_CARD_CLASS } from '@/constants/designTokens'

defineProps<{
  title: string
  description: string
  actionLabel: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div :class="[AGENDAR_CARD_CLASS, 'agendar-opcao-card flex items-center gap-4 p-4 sm:px-5']">
    <div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-glow-gold/15 text-glow-gold">
      <slot name="icon" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="font-montserrat text-base font-semibold text-glow-text">{{ title }}</p>
      <p class="mt-0.5 font-poppins text-sm font-light text-glow-text-muted">{{ description }}</p>
    </div>
    <button
      type="button"
      :class="[AGENDAR_BTN_OUTLINE_CLASS, 'agendar-opcao-card__action']"
      :aria-label="actionLabel"
      @click="emit('action')"
    >
      <span class="agendar-opcao-card__action-label">{{ actionLabel }}</span>
      <svg class="size-2.5" viewBox="0 0 5 10" fill="none" aria-hidden="true">
        <path
          d="M0.5 0.5L4.5 5L0.5 9.5"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>
