<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import { lojaAgendarPath } from '@/constants/routes'
import type { ServicoPublico } from '@/types/agendamento.types'
import { formatCurrency, formatPrecoRange } from '@/utils/formatters'

const props = defineProps<{
  servicos: ServicoPublico[]
  publicGuid: string
  categoria: string | null
}>()

const { isVisible } = useRevealOnScroll()

type DuracaoFiltro = 'todos' | 'rapido' | 'medio' | 'longo'
type Ordenacao = 'nome' | 'preco-asc' | 'preco-desc' | 'duracao'

const PAGE_SIZE = 24

const busca = ref('')
const filtroDuracao = ref<DuracaoFiltro>('todos')
const ordenacao = ref<Ordenacao>('nome')
const limite = ref(PAGE_SIZE)

const filtrosDuracao: Array<{ id: DuracaoFiltro; label: string }> = [
  { id: 'todos', label: 'Todos' },
  { id: 'rapido', label: 'Até 30 min' },
  { id: 'medio', label: '31–60 min' },
  { id: 'longo', label: 'Mais de 1 h' },
]

const ordenacoes: Array<{ id: Ordenacao; label: string }> = [
  { id: 'nome', label: 'Nome' },
  { id: 'preco-asc', label: 'Menor preço' },
  { id: 'preco-desc', label: 'Maior preço' },
  { id: 'duracao', label: 'Duração' },
]

watch([busca, filtroDuracao, ordenacao], () => {
  limite.value = PAGE_SIZE
})

function matchDuracao(servico: ServicoPublico, filtro: DuracaoFiltro) {
  const mins = servico.duracaoMinutosEstimada
  if (filtro === 'rapido') return mins <= 30
  if (filtro === 'medio') return mins > 30 && mins <= 60
  if (filtro === 'longo') return mins > 60
  return true
}

const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()

  let lista = props.servicos.filter((s) => {
    if (!matchDuracao(s, filtroDuracao.value)) return false
    if (!q) return true
    const hay = `${s.nome} ${s.descricao ?? ''}`.toLowerCase()
    return hay.includes(q)
  })

  lista = [...lista].sort((a, b) => {
    if (ordenacao.value === 'preco-asc') return a.precoMinimo - b.precoMinimo
    if (ordenacao.value === 'preco-desc') return b.precoMinimo - a.precoMinimo
    if (ordenacao.value === 'duracao') {
      return a.duracaoMinutosEstimada - b.duracaoMinutosEstimada || a.nome.localeCompare(b.nome, 'pt-BR')
    }
    return a.nome.localeCompare(b.nome, 'pt-BR')
  })

  return lista
})

const visiveis = computed(() => filtrados.value.slice(0, limite.value))
const temMais = computed(() => filtrados.value.length > limite.value)
const restantes = computed(() => Math.max(0, filtrados.value.length - limite.value))

/** Agrupa por inicial quando o catálogo filtrado é grande e ordenado por nome. */
const grupos = computed(() => {
  const items = visiveis.value
  if (ordenacao.value !== 'nome' || filtrados.value.length < 16) {
    return [{ key: 'all', label: null as string | null, itens: items }]
  }

  const map = new Map<string, ServicoPublico[]>()
  for (const s of items) {
    const letter = (s.nome.trim().charAt(0) || '#').toUpperCase()
    const key = /[A-ZÀ-Ü]/.test(letter) ? letter : '#'
    const bucket = map.get(key) ?? []
    bucket.push(s)
    map.set(key, bucket)
  }

  return Array.from(map.entries()).map(([key, itens]) => ({
    key,
    label: key,
    itens,
  }))
})

const contagemFiltros = computed(() => {
  const base = props.servicos
  return {
    todos: base.length,
    rapido: base.filter((s) => s.duracaoMinutosEstimada <= 30).length,
    medio: base.filter((s) => s.duracaoMinutosEstimada > 30 && s.duracaoMinutosEstimada <= 60).length,
    longo: base.filter((s) => s.duracaoMinutosEstimada > 60).length,
  }
})

function precoLabel(servico: ServicoPublico) {
  if (servico.precoMinimo === servico.precoMaximo) {
    return formatCurrency(servico.precoMinimo)
  }
  return formatPrecoRange(servico.precoMinimo, servico.precoMaximo)
}

function verMais() {
  limite.value += PAGE_SIZE
}

function limparBusca() {
  busca.value = ''
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
          :subtitle="
            servicos.length > 12
              ? 'Busque, filtre por duração e compare opções — o catálogo foi pensado para lojas com muitos serviços.'
              : 'Compare duração e investimento, escolha o serviço ideal e reserve em poucos cliques.'
          "
        />

        <p
          v-if="servicos.length === 0"
          class="mx-auto mt-14 max-w-lg text-center font-poppins text-base font-light text-white/50"
        >
          Nenhum serviço público disponível no momento. Volte em breve ou fale com a loja.
        </p>

        <template v-else>
          <!-- Toolbar -->
          <div
            class="sticky top-[4.25rem] z-30 mt-10 rounded-2xl border border-white/10 bg-[#0b0818]/90 p-3 backdrop-blur-xl sm:p-4"
          >
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label class="relative min-w-0 flex-1">
                <span class="sr-only">Buscar serviço</span>
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
                  placeholder="Buscar por nome…"
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

              <label class="flex shrink-0 items-center gap-2">
                <span class="sr-only">Ordenar</span>
                <select
                  v-model="ordenacao"
                  class="h-11 rounded-full border border-white/15 bg-white/[0.05] px-4 font-satoshi text-sm text-white outline-none transition focus:border-glow-gold/45"
                >
                  <option
                    v-for="opt in ordenacoes"
                    :key="opt.id"
                    :value="opt.id"
                    class="bg-[#120a2a] text-white"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </label>
            </div>

            <div class="mt-3 flex flex-wrap gap-2" role="toolbar" aria-label="Filtros por duração">
              <button
                v-for="filtro in filtrosDuracao"
                :key="filtro.id"
                type="button"
                class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-satoshi text-xs font-semibold transition"
                :class="
                  filtroDuracao === filtro.id
                    ? 'border-glow-gold/40 bg-glow-gold/15 text-glow-gold'
                    : 'border-white/12 bg-white/[0.04] text-white/60 hover:border-white/25 hover:text-white'
                "
                @click="filtroDuracao = filtro.id"
              >
                {{ filtro.label }}
                <span class="tabular-nums text-[10px] opacity-70">
                  {{ contagemFiltros[filtro.id] }}
                </span>
              </button>
            </div>
          </div>

          <div class="mt-4 flex items-baseline justify-between gap-3">
            <p class="font-satoshi text-xs font-medium text-white/45">
              <template v-if="filtrados.length === 0">Nenhum serviço encontrado</template>
              <template v-else>
                {{ filtrados.length }}
                serviço{{ filtrados.length === 1 ? '' : 's' }}
                <span v-if="visiveis.length < filtrados.length">
                  · mostrando {{ visiveis.length }}
                </span>
              </template>
            </p>
            <p
              v-if="categoria"
              class="hidden font-satoshi text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30 sm:block"
            >
              {{ categoria }}
            </p>
          </div>

          <div
            v-if="filtrados.length === 0"
            class="mt-8 rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center"
          >
            <p class="font-montserrat text-base font-semibold text-white/80">
              Nada por aqui
            </p>
            <p class="mt-2 font-poppins text-sm font-light text-white/45">
              Ajuste a busca ou os filtros para ver outros serviços.
            </p>
            <button
              type="button"
              class="mt-5 font-satoshi text-sm font-semibold text-glow-gold transition hover:opacity-80"
              @click="busca = ''; filtroDuracao = 'todos'"
            >
              Limpar filtros
            </button>
          </div>

          <div
            v-else
            ref="revealRoot"
            class="landing-stagger mt-5 space-y-8"
            :class="isVisible && 'is-visible'"
          >
            <section
              v-for="grupo in grupos"
              :key="grupo.key"
            >
              <h3
                v-if="grupo.label"
                class="mb-3 flex items-center gap-3 font-satoshi text-xs font-semibold uppercase tracking-[0.2em] text-glow-gold/80"
              >
                <span>{{ grupo.label }}</span>
                <span class="h-px flex-1 bg-white/10" aria-hidden="true" />
              </h3>

              <ul
                class="grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <li
                  v-for="servico in grupo.itens"
                  :key="servico.id"
                  class="group"
                >
                  <div
                    class="flex h-full flex-col justify-between rounded-2xl border border-white/12 bg-white/[0.045] px-3.5 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-glow-gold/30 hover:bg-white/[0.07]"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <h4 class="min-w-0 font-montserrat text-sm font-semibold leading-snug text-white sm:text-[0.9375rem]">
                        <span class="line-clamp-2">{{ servico.nome }}</span>
                      </h4>
                      <span
                        class="shrink-0 rounded-full border border-white/10 bg-black/20 px-2 py-0.5 font-satoshi text-[10px] font-semibold tabular-nums text-white/50"
                      >
                        {{ servico.duracaoMinutosEstimada }} min
                      </span>
                    </div>

                    <div class="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-2.5">
                      <p class="min-w-0 truncate font-montserrat text-sm font-bold text-glow-gold">
                        {{ precoLabel(servico) }}
                      </p>
                      <RouterLink
                        :to="lojaAgendarPath(publicGuid)"
                        class="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/20 px-2.5 py-1 font-satoshi text-[11px] font-semibold text-white/80 transition group-hover:border-glow-gold/40 group-hover:text-white"
                      >
                        Agendar
                        <span aria-hidden="true">→</span>
                      </RouterLink>
                    </div>
                  </div>
                </li>
              </ul>
            </section>
          </div>

          <div v-if="temMais" class="mt-8 flex justify-center">
            <button
              type="button"
              class="rounded-full border border-white/20 bg-white/[0.05] px-6 py-2.5 font-satoshi text-sm font-semibold text-white transition hover:border-glow-gold/35 hover:bg-white/[0.08]"
              @click="verMais"
            >
              Ver mais {{ Math.min(PAGE_SIZE, restantes) }} serviços
              <span class="text-white/40">({{ restantes }} restantes)</span>
            </button>
          </div>
        </template>
      </div>
    </div>
  </LandingStorySection>
</template>
