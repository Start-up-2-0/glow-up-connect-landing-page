<script setup lang="ts">
import { formatLimite } from '@/utils/formatters'
import { PLANO_LIMITE_ITEMS } from '@/utils/planoDisplay'
import type { Plano } from '@/types/plano.types'

defineProps<{
  plano: Plano
  variant?: 'card' | 'modal'
}>()
</script>

<template>
  <div
    class="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl px-3 py-3"
    :class="
      variant === 'modal'
        ? 'border border-glow-text/10 bg-glow-canvas/80'
        : 'border border-white/10 bg-white/[0.06]'
    "
  >
    <div v-for="item in PLANO_LIMITE_ITEMS" :key="item.key">
      <p
        class="font-montserrat font-bold uppercase tracking-wide"
        :class="
          variant === 'modal'
            ? 'text-[10px] text-glow-text/50'
            : 'text-[9px] text-white/40'
        "
      >
        {{ item.label }}
      </p>
      <p
        class="font-poppins font-medium"
        :class="
          variant === 'modal'
            ? 'text-sm text-glow-text'
            : 'text-xs text-white/85'
        "
      >
        {{ formatLimite(plano[item.key]) }}
      </p>
    </div>
  </div>
</template>
