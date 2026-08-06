<script setup lang="ts">
import { computed } from 'vue'
import { maskTelefoneLocal, telefoneLocalFromInput, maskTelefoneUnified } from '@/utils/formatters'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    id?: string
    hint?: string
    error?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    autocomplete?: string
    showDdiPrefix?: boolean
    unified?: boolean
  }>(),
  {
    placeholder: '(79) 99191-7634',
    autocomplete: 'tel-national',
    showDdiPrefix: true,
    unified: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const inputId = props.id ?? `telefone-${Math.random().toString(36).slice(2, 9)}`

const displayValue = computed(() => {
  if (props.unified) return maskTelefoneUnified(props.modelValue)
  return maskTelefoneLocal(props.modelValue)
})

const prefixClass =
  'inline-flex h-11 shrink-0 items-center rounded-l-lg border border-r-0 border-glow-border-soft bg-glow-surface px-3.5 font-urbanist text-sm font-medium text-glow-text-subtle'

const dashboardInputClass =
  'h-11 w-full border border-glow-border-soft bg-glow-hover-surface px-3.5 font-urbanist text-sm text-glow-text outline-none transition placeholder:text-glow-placeholder focus:border-glow-gold focus:ring-1 focus:ring-glow-gold disabled:cursor-not-allowed disabled:opacity-60'

const inputClass = computed(() => {
  let shape: string
  if (props.unified) {
    shape = `${dashboardInputClass} rounded-lg`
  } else if (props.showDdiPrefix) {
    shape = `${dashboardInputClass} rounded-r-lg`
  } else {
    shape = `${dashboardInputClass} rounded-lg`
  }
  return props.error ? `${shape} field-input--error` : shape
})

const describedBy = computed(() => {
  if (props.error) return `${inputId}-error`
  if (props.hint) return `${inputId}-hint`
  return undefined
})

const allowedKeys = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
])

function onInput(event: Event) {
  const input = event.target as HTMLInputElement
  const digits = telefoneLocalFromInput(input.value)
  emit('update:modelValue', digits)
  input.value = props.unified ? maskTelefoneUnified(digits) : maskTelefoneLocal(digits)
}

function onKeydown(event: KeyboardEvent) {
  if (allowedKeys.has(event.key) || event.ctrlKey || event.metaKey) return
  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}
</script>

<template>
  <div class="field-group">
    <label
      v-if="label"
      :for="inputId"
      class="font-urbanist text-sm font-medium text-glow-text"
    >
      {{ label }}
    </label>
    <div class="flex">
      <span v-if="showDdiPrefix && !unified" :class="prefixClass" aria-hidden="true">+55</span>
      <input
        :id="inputId"
        :value="displayValue"
        type="tel"
        inputmode="numeric"
        :placeholder="unified ? '+55 (79) 99191-7634' : placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :class="inputClass"
        @input="onInput"
        @keydown="onKeydown"
      />
    </div>
    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="font-urbanist text-xs leading-snug text-red-600"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      :id="`${inputId}-hint`"
      class="font-urbanist text-xs leading-snug text-glow-text-subtle"
    >
      {{ hint }}
    </p>
  </div>
</template>
