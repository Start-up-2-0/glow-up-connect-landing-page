<script setup lang="ts">
import { computed } from 'vue'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

const props = withDefaults(
  defineProps<{
    variant?: AlertVariant
    title?: string
    dismissible?: boolean
  }>(),
  {
    variant: 'info',
    dismissible: false,
  },
)

const emit = defineEmits<{ dismiss: [] }>()

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-blue-400/30 bg-blue-500/10 text-blue-100',
  success: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
  warning: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
  error: 'border-red-400/30 bg-red-500/10 text-red-100',
}

const rootClass = computed(
  () =>
    `rounded-lg border px-4 py-3 font-urbanist text-sm leading-relaxed ${variantClasses[props.variant]}`,
)
</script>

<template>
  <div role="alert" :class="rootClass">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <p v-if="title" class="mb-1 font-semibold">{{ title }}</p>
        <slot />
      </div>
      <button
        v-if="dismissible"
        type="button"
        class="shrink-0 rounded p-0.5 opacity-70 transition hover:opacity-100"
        aria-label="Fechar"
        @click="emit('dismiss')"
      >
        &times;
      </button>
    </div>
  </div>
</template>
