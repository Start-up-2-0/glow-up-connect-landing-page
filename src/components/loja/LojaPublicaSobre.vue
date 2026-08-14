<script setup lang="ts">
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'

defineProps<{
  descricao: string | null
  categoria: string | null
}>()

const { isVisible } = useRevealOnScroll()

const diferenciais = [
  {
    titulo: 'Hora marcada',
    texto: 'Reserve o horário ideal e evite espera desnecessária.',
  },
  {
    titulo: 'Agendamento online',
    texto: 'Escolha serviço e profissional em poucos cliques.',
  },
  {
    titulo: 'Parceiro Glow Up',
    texto: 'Operação conectada à plataforma Glow Up Connect.',
  },
] as const
</script>

<template>
  <LandingStorySection :show-progress="false">
    <div class="px-4 pb-16 pt-4 lg:px-8 lg:pb-24 lg:pt-6">
      <div class="mx-auto max-w-[1280px]">
        <div class="mx-auto max-w-3xl text-center">
          <LandingSectionHeader
            eyebrow="Sobre a loja"
            title="A história"
            highlight="por trás do atendimento"
            :subtitle="
              descricao
                || 'Um espaço pensado para oferecer atendimento com qualidade, cuidado e hora marcada — do primeiro contato ao resultado final.'
            "
          />

          <p
            v-if="categoria"
            class="mt-6 inline-flex rounded-full border border-glow-gold/30 bg-glow-gold/10 px-4 py-1.5 font-satoshi text-xs font-semibold text-glow-gold"
          >
            {{ categoria }}
          </p>
        </div>

        <ul
          ref="revealRoot"
          class="landing-stagger mt-12 grid list-none gap-4 p-0 sm:grid-cols-3"
          :class="isVisible && 'is-visible'"
          aria-label="Diferenciais"
        >
          <li
            v-for="item in diferenciais"
            :key="item.titulo"
            class="rounded-2xl border border-glow-border-soft bg-glow-surface px-5 py-6 text-center transition duration-200 hover:-translate-y-0.5 hover:border-glow-gold/25 hover:bg-glow-hover-surface sm:px-6"
          >
            <h3 class="font-montserrat text-base font-semibold text-glow-text">
              {{ item.titulo }}
            </h3>
            <p class="mt-2 font-poppins text-sm font-light leading-relaxed text-glow-text-muted">
              {{ item.texto }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </LandingStorySection>
</template>
