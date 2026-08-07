<script setup lang="ts">
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'

defineProps<{
  descricao: string | null
  categoria: string | null
  nome: string
  logo: string | null
}>()

const { isVisible } = useRevealOnScroll()
</script>

<template>
  <LandingStorySection
    chapter-index="01"
    chapter-label="A loja"
    :show-progress="false"
  >
    <div class="px-4 pb-16 pt-4 lg:px-8 lg:pb-24 lg:pt-6">
      <div class="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <LandingSectionHeader
            align="left"
            eyebrow="Sobre a loja"
            title="Conheça"
            highlight="o estabelecimento"
            :subtitle="
              descricao
                || 'Um espaço pensado para oferecer atendimento com qualidade, cuidado e hora marcada — do primeiro contato ao resultado final.'
            "
          />

          <ul
            ref="revealRoot"
            class="landing-stagger mt-10 flex flex-wrap gap-2.5"
            :class="isVisible && 'is-visible'"
            aria-label="Diferenciais"
          >
            <li
              v-if="categoria"
              class="rounded-full border border-glow-gold/30 bg-glow-gold/10 px-4 py-2 font-satoshi text-xs font-semibold text-glow-gold"
            >
              {{ categoria }}
            </li>
            <li class="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 font-satoshi text-xs font-semibold text-white/75">
              Atendimento com hora marcada
            </li>
            <li class="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 font-satoshi text-xs font-semibold text-white/75">
              Parceiro Glow Up Connect
            </li>
            <li class="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 font-satoshi text-xs font-semibold text-white/75">
              Agendamento online
            </li>
          </ul>
        </div>

        <div
          class="relative isolate overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] p-8 landing-glass-card sm:p-10"
        >
          <div
            class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-glow-gold/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            class="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-glow-purple/40 blur-3xl"
            aria-hidden="true"
          />

          <div class="relative mx-auto flex max-w-xs flex-col items-center text-center">
            <div
              class="flex size-36 items-center justify-center overflow-hidden rounded-[1.75rem] border border-glow-gold/35 bg-[#0a0718] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] sm:size-44"
            >
              <img
                v-if="logo"
                :src="logo"
                :alt="`Logo de ${nome}`"
                class="size-full object-contain p-5"
                loading="lazy"
                decoding="async"
              />
              <span
                v-else
                class="font-montserrat text-5xl font-black text-glow-gold"
                aria-hidden="true"
              >
                {{ nome.charAt(0) }}
              </span>
            </div>
            <p class="mt-6 font-montserrat text-xl font-semibold text-white">{{ nome }}</p>
            <p class="mt-2 font-poppins text-sm font-light leading-relaxed text-white/55">
              Identidade e atendimento sob o ecossistema Glow Up Connect.
            </p>
          </div>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
