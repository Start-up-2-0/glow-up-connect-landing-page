<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import { lojaAgendarComProfissionalPath, lojaAgendarPath } from '@/constants/routes'
import type { ProfissionalVitrinePublico } from '@/types/avaliacao.types'

const props = defineProps<{
  profissionais: ProfissionalVitrinePublico[]
  publicGuid: string
  categoria: string | null
}>()

const { isVisible } = useRevealOnScroll()

type Ordenacao = 'nome' | 'nota'

const PAGE_SIZE = 12

const busca = ref('')
const ordenacao = ref<Ordenacao>('nome')
const limite = ref(PAGE_SIZE)

watch([busca, ordenacao], () => {
  limite.value = PAGE_SIZE
})

const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  let lista = props.profissionais.filter((p) => {
    if (!q) return true
    const hay = `${p.nomePublico} ${p.biografia ?? ''}`.toLowerCase()
    return hay.includes(q)
  })

  lista = [...lista].sort((a, b) => {
    if (ordenacao.value === 'nota') {
      const na = a.notaMedia ?? -1
      const nb = b.notaMedia ?? -1
      if (nb !== na) return nb - na
    }
    return a.nomePublico.localeCompare(b.nomePublico, 'pt-BR')
  })

  return lista
})

const visiveis = computed(() => filtrados.value.slice(0, limite.value))
const temMais = computed(() => filtrados.value.length > limite.value)
const restantes = computed(() => Math.max(0, filtrados.value.length - limite.value))

function verMais() {
  limite.value += PAGE_SIZE
}

function limparBusca() {
  busca.value = ''
}

function notaLabel(prof: ProfissionalVitrinePublico) {
  if ((prof.notaMedia ?? 0) <= 0) return null
  return Number(prof.notaMedia).toFixed(1).replace('.', ',')
}
</script>

<template>
  <LandingStorySection :show-progress="false">
    <div class="px-4 pb-16 pt-4 lg:px-8 lg:pb-24 lg:pt-6">
      <div class="mx-auto max-w-[1280px]">
        <LandingSectionHeader
          eyebrow="Profissionais"
          title="Quem vai"
          highlight="te atender"
          :subtitle="
            profissionais.length > 8
              ? 'Compare a equipe com rapidez — busque pelo nome e agende com quem preferir.'
              : 'Conheça a equipe e, se preferir, já inicie o agendamento com o profissional da sua escolha.'
          "
        />

        <div
          v-if="profissionais.length === 0"
          class="mx-auto mt-12 max-w-xl rounded-2xl border border-white/15 bg-white/[0.06] px-8 py-12 text-center landing-glass-card"
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

        <template v-else>
          <div
            v-if="profissionais.length > 6"
            class="sticky top-[4.25rem] z-30 mt-10 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0b0818]/90 p-3 backdrop-blur-xl sm:flex-row sm:items-center sm:p-4"
          >
            <label class="relative min-w-0 flex-1">
              <span class="sr-only">Buscar profissional</span>
              <svg
                class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" stroke-linecap="round" />
              </svg>
              <input
                v-model="busca"
                type="search"
                placeholder="Buscar profissional…"
                class="h-11 w-full rounded-full border border-white/15 bg-white/[0.05] py-2 pl-10 pr-10 font-satoshi text-sm text-white outline-none transition placeholder:text-white/35 focus:border-glow-gold/45 focus:ring-1 focus:ring-glow-gold/30"
              />
              <button
                v-if="busca"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/40 transition hover:text-white"
                aria-label="Limpar busca"
                @click="limparBusca"
              >
                ×
              </button>
            </label>

            <div
              class="flex shrink-0 gap-2"
              role="toolbar"
              aria-label="Ordenar equipe"
            >
              <button
                type="button"
                class="rounded-full border px-3.5 py-2 font-satoshi text-xs font-semibold transition"
                :class="
                  ordenacao === 'nome'
                    ? 'border-glow-gold/40 bg-glow-gold/15 text-glow-gold'
                    : 'border-white/12 bg-white/[0.04] text-white/60 hover:text-white'
                "
                @click="ordenacao = 'nome'"
              >
                Nome
              </button>
              <button
                type="button"
                class="rounded-full border px-3.5 py-2 font-satoshi text-xs font-semibold transition"
                :class="
                  ordenacao === 'nota'
                    ? 'border-glow-gold/40 bg-glow-gold/15 text-glow-gold'
                    : 'border-white/12 bg-white/[0.04] text-white/60 hover:text-white'
                "
                @click="ordenacao = 'nota'"
              >
                Melhor avaliação
              </button>
            </div>
          </div>

          <p class="mt-4 font-satoshi text-xs font-medium text-white/45">
            <template v-if="filtrados.length === 0">Nenhum profissional encontrado</template>
            <template v-else>
              {{ filtrados.length }}
              profissional{{ filtrados.length === 1 ? '' : 'is' }}
              <span v-if="visiveis.length < filtrados.length">
                · mostrando {{ visiveis.length }}
              </span>
            </template>
          </p>

          <div
            v-if="filtrados.length === 0"
            class="mt-8 rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center"
          >
            <p class="font-montserrat text-base font-semibold text-white/80">Nada por aqui</p>
            <p class="mt-2 font-poppins text-sm font-light text-white/45">
              Ajuste a busca para ver outros profissionais.
            </p>
            <button
              type="button"
              class="mt-5 font-satoshi text-sm font-semibold text-glow-gold transition hover:opacity-80"
              @click="limparBusca"
            >
              Limpar busca
            </button>
          </div>

          <ul
            v-else
            ref="revealRoot"
            class="landing-stagger mt-5 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-4 xl:grid-cols-5"
            :class="isVisible && 'is-visible'"
          >
            <li
              v-for="prof in visiveis"
              :key="prof.publicGuid"
              class="group"
            >
              <article
                class="flex h-full flex-col items-center rounded-2xl border border-white/12 bg-white/[0.045] px-3 py-4 text-center transition duration-200 hover:-translate-y-0.5 hover:border-glow-gold/30 hover:bg-white/[0.07] sm:px-3.5 sm:py-5"
                :title="prof.biografia?.trim() || undefined"
              >
                <div
                  class="relative size-[4.5rem] overflow-hidden rounded-full border border-glow-gold/30 bg-[#120a2a] shadow-[0_10px_28px_-16px_rgba(0,0,0,0.85)] sm:size-[5.25rem]"
                >
                  <img
                    v-if="prof.logo"
                    :src="prof.logo"
                    :alt="`Foto de ${prof.nomePublico}`"
                    class="size-full object-cover object-center transition duration-300 group-hover:scale-[1.04]"
                    width="84"
                    height="84"
                    loading="lazy"
                    decoding="async"
                  />
                  <span
                    v-else
                    class="flex size-full items-center justify-center font-montserrat text-xl font-black text-glow-gold"
                    aria-hidden="true"
                  >
                    {{ prof.nomePublico.charAt(0) }}
                  </span>
                </div>

                <h3 class="mt-3 line-clamp-2 w-full font-montserrat text-sm font-semibold leading-snug text-white sm:text-[0.9375rem]">
                  {{ prof.nomePublico }}
                </h3>

                <p
                  v-if="categoria"
                  class="mt-1 line-clamp-1 font-satoshi text-[10px] font-semibold uppercase tracking-[0.12em] text-glow-gold/85"
                >
                  {{ categoria }}
                </p>

                <p
                  v-if="notaLabel(prof)"
                  class="mt-2 inline-flex items-center gap-1 font-satoshi text-xs font-semibold text-white/70"
                >
                  <span class="text-glow-gold" aria-hidden="true">★</span>
                  {{ notaLabel(prof) }}
                  <span
                    v-if="(prof.totalAvaliacoes ?? 0) > 0"
                    class="font-normal text-white/40"
                  >
                    ({{ prof.totalAvaliacoes }})
                  </span>
                </p>
                <p
                  v-else
                  class="mt-2 font-satoshi text-[11px] text-white/35"
                >
                  Sem avaliações
                </p>

                <RouterLink
                  :to="lojaAgendarComProfissionalPath(publicGuid, prof.publicGuid)"
                  class="mt-3 inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 font-satoshi text-[11px] font-semibold text-white/75 transition group-hover:border-glow-gold/40 group-hover:text-white"
                >
                  Agendar
                  <span aria-hidden="true">→</span>
                </RouterLink>
              </article>
            </li>
          </ul>

          <div v-if="temMais" class="mt-8 flex justify-center">
            <button
              type="button"
              class="rounded-full border border-white/20 bg-white/[0.05] px-6 py-2.5 font-satoshi text-sm font-semibold text-white transition hover:border-glow-gold/35 hover:bg-white/[0.08]"
              @click="verMais"
            >
              Ver mais {{ Math.min(PAGE_SIZE, restantes) }} profissionais
              <span class="text-white/40">({{ restantes }} restantes)</span>
            </button>
          </div>
        </template>
      </div>
    </div>
  </LandingStorySection>
</template>
