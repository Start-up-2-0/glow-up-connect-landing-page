<script setup lang="ts">
import type { TipoAssinatura } from '@/types/plano.types'

defineProps<{
  modelValue: TipoAssinatura | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TipoAssinatura]
}>()

const opcoes: Array<{
  value: TipoAssinatura
  titulo: string
  descricao: string
}> = [
  {
    value: 'Estabelecimento',
    titulo: 'Tenho barbearia ou salão com equipe',
    descricao:
      'Agenda por profissional, comissões e acessos — do time pequeno à operação maior.',
  },
  {
    value: 'ProfissionalAutonomo',
    titulo: 'Trabalho como profissional autônomo',
    descricao:
      'Atendo sozinho. Agenda, clientes e serviços no celular, sem montar equipe.',
  },
]
</script>

<template>
  <fieldset class="mx-auto max-w-3xl space-y-4">
    <legend class="w-full text-center font-satoshi text-lg font-bold text-glow-text sm:text-xl">
      Como você trabalha?
    </legend>
    <p class="text-center font-urbanist text-sm text-glow-text-muted">
      Os planos e a experiência mudam conforme o modelo. Escolha o que combina com a sua rotina.
    </p>

    <div class="grid gap-3 sm:grid-cols-2">
      <button
        v-for="opcao in opcoes"
        :key="opcao.value"
        type="button"
        class="rounded-2xl border p-4 text-left transition duration-200"
        :class="
          modelValue === opcao.value
            ? 'border-glow-gold-cta bg-glow-gold-cta/15 ring-2 ring-glow-gold-cta'
            : 'border-glow-border-soft bg-glow-hover-surface hover:border-glow-gold-cta/50 hover:bg-glow-hover-surface'
        "
        @click="emit('update:modelValue', opcao.value)"
      >
        <span class="block font-satoshi text-sm font-bold text-glow-text">{{ opcao.titulo }}</span>
        <span class="mt-1.5 block font-urbanist text-xs leading-relaxed text-glow-text-muted">
          {{ opcao.descricao }}
        </span>
      </button>
    </div>
  </fieldset>
</template>
