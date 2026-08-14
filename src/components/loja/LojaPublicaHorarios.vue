<script setup lang="ts">
import { computed } from 'vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'

const props = defineProps<{
  abertoAgora?: boolean | null
  horarioAbertura?: string | null
  horarioFechamento?: string | null
}>()

const { isVisible } = useRevealOnScroll()

const hojeLabel = computed(() => {
  if (props.horarioAbertura && props.horarioFechamento) {
    return `${props.horarioAbertura} – ${props.horarioFechamento}`
  }
  return null
})
</script>

<template>
  <LandingStorySection :show-progress="false">
    <div class="px-4 pb-16 pt-4 lg:px-8 lg:pb-24 lg:pt-6">
      <div class="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <LandingSectionHeader
          align="left"
          eyebrow="Funcionamento"
          title="Quando a loja"
          highlight="está aberta"
          subtitle="Confira o status de hoje. No agendamento você vê apenas os horários realmente disponíveis para reserva."
        />

        <div
          ref="revealRoot"
          class="landing-reveal"
          :class="isVisible && 'is-visible'"
        >
          <article
            class="relative overflow-hidden rounded-[2rem] border border-glow-border-soft bg-glow-surface p-7 landing-glass-card sm:p-9"
          >
            <div
              class="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-glow-gold/20 blur-3xl"
              aria-hidden="true"
            />

            <p class="font-satoshi text-[11px] font-semibold uppercase tracking-[0.2em] text-glow-text-muted">
              Hoje
            </p>

            <p
              v-if="abertoAgora != null"
              class="mt-4 font-montserrat text-3xl font-black sm:text-4xl"
              :class="abertoAgora ? 'text-glow-success' : 'text-glow-text-muted'"
            >
              {{ abertoAgora ? 'Aberto agora' : 'Fechado agora' }}
            </p>
            <p
              v-else
              class="mt-4 font-montserrat text-3xl font-black text-glow-text-muted sm:text-4xl"
            >
              Horário sob consulta
            </p>

            <p
              v-if="hojeLabel"
              class="mt-3 font-poppins text-lg font-light text-glow-text-subtle"
            >
              {{ hojeLabel }}
            </p>
            <p
              v-else
              class="mt-3 font-poppins text-base font-light text-glow-placeholder"
            >
              Intervalo de hoje ainda não informado.
            </p>

            <p class="mt-8 border-t border-glow-border-soft pt-5 font-poppins text-sm font-light leading-relaxed text-glow-text-muted">
              Dias e turnos podem variar. A disponibilidade real aparece ao escolher data e horário
              no fluxo de agendamento.
            </p>
          </article>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
