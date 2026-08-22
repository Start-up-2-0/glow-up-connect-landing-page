<script setup lang="ts">
import { HOW_IT_WORKS, LANDING_SECTIONS } from '@/constants/landing'
import { FEATURE_FLAGS } from '@/config/features'
import { STORY_CHAPTERS } from '@/constants/showcaseCallouts'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'

const { isVisible } = useRevealOnScroll()
const chapter = STORY_CHAPTERS.funcionamento
const subtitle = FEATURE_FLAGS.lojasHabilitadas
  ? 'Cadastro, configuração e primeiro agendamento. Quatro passos para colocar a agenda no ar.'
  : 'Cadastro, configuração e primeiro agendamento. Quatro passos para começar como autônomo.'
const passos = FEATURE_FLAGS.lojasHabilitadas
  ? HOW_IT_WORKS
  : HOW_IT_WORKS.map((step) =>
      step.step === '01'
        ? {
            ...step,
            descricao:
              'Cadastre-se como profissional autônomo. Funciona no navegador, sem instalar nada.',
          }
        : step.step === '02'
          ? {
              ...step,
              descricao:
                'Inclua serviços, preços e horários de atendimento. Em poucos minutos a base já está pronta.',
            }
          : step,
    )
</script>

<template>
  <LandingStorySection
    :id="LANDING_SECTIONS.comoFunciona"
    tone="dark"
    :chapter-index="chapter.index"
    :chapter-label="chapter.label"
  >
    <div class="px-4 pb-20 pt-8 lg:px-8 lg:pb-28 lg:pt-6">
      <div class="mx-auto max-w-[1280px]">
        <LandingSectionHeader
          eyebrow="Como funciona"
          title="Do cadastro"
          highlight="ao primeiro horário"
          :subtitle="subtitle"
        />

        <div class="relative mt-12 sm:mt-16">
          <div
            class="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-transparent via-glow-gold/40 to-transparent xl:block"
            aria-hidden="true"
          />

          <ol
            ref="revealRoot"
            class="landing-stagger relative grid gap-6 md:grid-cols-2 xl:grid-cols-4"
            :class="isVisible && 'is-visible'"
          >
            <li
              v-for="step in passos"
              :key="step.step"
              class="group relative rounded-3xl border border-glow-border-soft bg-glow-surface p-5 landing-glass-card transition duration-300 hover:-translate-y-1 hover:border-glow-gold/30 hover:bg-glow-hover-surface sm:p-6"
            >
              <span
                class="landing-icon-pop inline-flex size-12 items-center justify-center rounded-2xl bg-glow-gold/15 font-montserrat text-sm font-black text-glow-gold"
              >
                {{ step.step }}
              </span>
              <h3 class="mt-5 font-montserrat text-xl font-semibold text-glow-text">
                {{ step.titulo }}
              </h3>
              <p class="mt-3 font-poppins text-sm leading-relaxed text-glow-text-muted">
                {{ step.descricao }}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
