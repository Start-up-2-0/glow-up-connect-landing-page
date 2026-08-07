<script setup lang="ts">
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import { lojaAgendarComProfissionalPath, lojaAgendarPath } from '@/constants/routes'
import type { ProfissionalVitrinePublico } from '@/types/avaliacao.types'

defineProps<{
  profissionais: ProfissionalVitrinePublico[]
  publicGuid: string
  categoria: string | null
}>()

const { isVisible } = useRevealOnScroll()
</script>

<template>
  <LandingStorySection
    chapter-index="03"
    chapter-label="Equipe"
    :show-progress="false"
  >
    <div class="relative overflow-x-clip px-4 pb-16 pt-4 lg:px-8 lg:pb-24 lg:pt-6">
      <div
        class="pointer-events-none absolute inset-x-0 top-1/3 h-64 bg-gradient-to-r from-transparent via-glow-purple/15 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div class="relative mx-auto max-w-[1280px]">
        <LandingSectionHeader
          eyebrow="Profissionais"
          title="Quem vai"
          highlight="te atender"
          subtitle="Conheça a equipe e, se preferir, já inicie o agendamento com o profissional da sua escolha."
        />

        <div
          v-if="profissionais.length === 0"
          class="mx-auto mt-14 max-w-xl rounded-[1.75rem] border border-white/15 bg-white/[0.06] px-8 py-12 text-center landing-glass-card"
        >
          <p class="font-montserrat text-lg font-semibold text-white">
            Equipe em atualização
          </p>
          <p class="mt-3 font-poppins text-sm font-light leading-relaxed text-white/55">
            Nenhum profissional disponível para exibição pública no momento. Você ainda pode
            agendar e escolher quem te atende no fluxo de reserva.
          </p>
          <div class="mt-8 flex justify-center">
            <LandingCtaButton
              label="Agendar mesmo assim"
              variant="gold"
              size="sm"
              :to="lojaAgendarPath(publicGuid)"
            />
          </div>
        </div>

        <ul
          v-else
          ref="revealRoot"
          class="landing-stagger mt-14 grid list-none gap-6 p-0 md:grid-cols-2 xl:grid-cols-3"
          :class="isVisible && 'is-visible'"
        >
          <li
            v-for="prof in profissionais"
            :key="prof.publicGuid"
            class="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.06] landing-glass-card transition duration-300 hover:-translate-y-1 hover:border-glow-gold/30 hover:bg-white/[0.08]"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-[#120a2a]">
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#0b0818] via-transparent to-transparent opacity-80"
                aria-hidden="true"
              />
              <img
                v-if="prof.logo"
                :src="prof.logo"
                :alt="`Foto de ${prof.nomePublico}`"
                class="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
              <div
                v-else
                class="flex size-full items-center justify-center bg-gradient-to-br from-glow-purple/40 to-[#0d0820]"
                aria-hidden="true"
              >
                <span class="font-montserrat text-5xl font-black text-glow-gold/80">
                  {{ prof.nomePublico.charAt(0) }}
                </span>
              </div>

              <div
                v-if="(prof.notaMedia ?? 0) > 0"
                class="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 backdrop-blur-md"
              >
                <span class="text-glow-gold" aria-hidden="true">★</span>
                <span class="font-satoshi text-xs font-semibold text-white">
                  {{ Number(prof.notaMedia).toFixed(1).replace('.', ',') }}
                  <span
                    v-if="(prof.totalAvaliacoes ?? 0) > 0"
                    class="font-normal text-white/55"
                  >
                    · {{ prof.totalAvaliacoes }}
                  </span>
                </span>
              </div>
            </div>

            <div class="flex flex-1 flex-col p-6 sm:p-7">
              <p
                v-if="categoria"
                class="font-satoshi text-[11px] font-semibold uppercase tracking-[0.18em] text-glow-gold"
              >
                {{ categoria }}
              </p>
              <h3 class="mt-2 font-montserrat text-xl font-semibold text-white sm:text-2xl">
                {{ prof.nomePublico }}
              </h3>
              <p
                class="mt-3 flex-1 font-poppins text-sm font-light leading-relaxed text-white/55 line-clamp-3"
              >
                {{
                  prof.biografia?.trim()
                  || 'Profissional parceiro desta loja, pronto para te atender com hora marcada.'
                }}
              </p>

              <div class="mt-6">
                <LandingCtaButton
                  label="Agendar com este profissional"
                  variant="outline"
                  size="sm"
                  :to="lojaAgendarComProfissionalPath(publicGuid, prof.publicGuid)"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </LandingStorySection>
</template>
