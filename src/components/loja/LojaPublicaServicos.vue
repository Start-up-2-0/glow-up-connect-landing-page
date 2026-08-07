<script setup lang="ts">
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import { lojaAgendarPath } from '@/constants/routes'
import type { ServicoPublico } from '@/types/agendamento.types'
import { formatCurrency, formatPrecoRange } from '@/utils/formatters'

defineProps<{
  servicos: ServicoPublico[]
  publicGuid: string
  categoria: string | null
}>()

const { isVisible } = useRevealOnScroll()

function precoLabel(servico: ServicoPublico) {
  if (servico.precoMinimo === servico.precoMaximo) {
    return `A partir de ${formatCurrency(servico.precoMinimo)}`
  }
  return formatPrecoRange(servico.precoMinimo, servico.precoMaximo)
}
</script>

<template>
  <LandingStorySection
    chapter-index="02"
    chapter-label="Serviços"
    :show-progress="false"
  >
    <div class="px-4 pb-16 pt-4 lg:px-8 lg:pb-24 lg:pt-6">
      <div class="mx-auto max-w-[1280px]">
        <LandingSectionHeader
          eyebrow="Catálogo"
          title="O que você pode"
          highlight="agendar"
          subtitle="Compare duração e investimento, escolha o serviço ideal e reserve em poucos cliques."
        />

        <p
          v-if="servicos.length === 0"
          class="mx-auto mt-14 max-w-lg text-center font-poppins text-base font-light text-white/50"
        >
          Nenhum serviço público disponível no momento. Volte em breve ou fale com a loja.
        </p>

        <ul
          v-else
          ref="revealRoot"
          class="landing-stagger mt-14 grid list-none gap-5 p-0 sm:grid-cols-2 xl:grid-cols-3"
          :class="isVisible && 'is-visible'"
        >
          <li
            v-for="servico in servicos"
            :key="servico.id"
            class="group flex h-full flex-col rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-6 landing-glass-card transition duration-300 hover:-translate-y-1 hover:border-glow-gold/30 hover:bg-white/[0.08] sm:p-7"
          >
            <div class="flex items-start justify-between gap-3">
              <p
                v-if="categoria"
                class="font-satoshi text-[11px] font-semibold uppercase tracking-[0.18em] text-glow-gold"
              >
                {{ categoria }}
              </p>
              <span
                class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-satoshi text-xs font-semibold text-white/55"
              >
                {{ servico.duracaoMinutosEstimada }} min
              </span>
            </div>

            <h3 class="mt-4 font-montserrat text-xl font-semibold text-white sm:text-2xl">
              {{ servico.nome }}
            </h3>

            <p
              v-if="servico.descricao?.trim()"
              class="mt-3 flex-1 font-poppins text-sm font-light leading-relaxed text-white/55 line-clamp-3"
            >
              {{ servico.descricao }}
            </p>
            <p
              v-else
              class="mt-3 flex-1 font-poppins text-sm font-light leading-relaxed text-white/40"
            >
              Serviço disponível para agendamento online nesta loja.
            </p>

            <div class="mt-6 border-t border-white/10 pt-5">
              <p class="font-montserrat text-lg font-black text-glow-gold">
                {{ precoLabel(servico) }}
              </p>
              <div class="mt-4">
                <LandingCtaButton
                  label="Agendar"
                  variant="outline"
                  size="sm"
                  :to="lojaAgendarPath(publicGuid)"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </LandingStorySection>
</template>
