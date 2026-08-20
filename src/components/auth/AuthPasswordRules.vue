<script setup lang="ts">
import { computed } from 'vue'
import { PASSWORD_RULES } from '@/utils/passwordRules'

const props = defineProps<{
  password: string
}>()

const rules = computed(() =>
  PASSWORD_RULES.map((rule) => ({
    ...rule,
    met: rule.test(props.password),
  })),
)
</script>

<template>
  <div>
    <p class="font-urbanist text-xs font-semibold text-glow-text-subtle">Sua senha deve conter:</p>
    <ul class="mt-1 space-y-0.5">
      <li
        v-for="rule in rules"
        :key="rule.id"
        class="font-urbanist text-xs transition-colors"
        :class="rule.met ? 'text-glow-text-subtle' : 'text-glow-gold-cta'"
      >
        {{ rule.label }}
      </li>
    </ul>
  </div>
</template>
