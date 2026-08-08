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
    titulo: 'Tenho um estabelecimento com equipe',
    descricao: 'Barbearia, salão ou negócio com vários profissionais e gestão de equipe.',
  },
  {
    value: 'ProfissionalAutonomo',
    titulo: 'Trabalho como profissional autônomo',
    descricao: 'Atendo sozinho. Agenda, clientes e serviços pensados para a sua operação individual.',
  },
]
</script>

<template>
  <fieldset class="mx-auto max-w-3xl space-y-4">
    <legend class="w-full text-center font-satoshi text-lg font-bold text-white sm:text-xl">
      Como você trabalha?
    </legend>
    <p class="text-center font-urbanist text-sm text-white/65">
      Escolha o modelo certo para a sua realidade. Os planos e a experiência se adaptam a essa escolha.
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
            : 'border-white/15 bg-white/5 hover:border-glow-gold-cta/50 hover:bg-white/10'
        "
        @click="emit('update:modelValue', opcao.value)"
      >
        <span class="block font-satoshi text-sm font-bold text-white">{{ opcao.titulo }}</span>
        <span class="mt-1.5 block font-urbanist text-xs leading-relaxed text-white/60">
          {{ opcao.descricao }}
        </span>
      </button>
    </div>
  </fieldset>
</template>
