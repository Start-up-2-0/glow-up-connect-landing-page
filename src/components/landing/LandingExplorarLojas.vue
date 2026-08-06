<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import ExplorarLojasMapa from '@/components/explorar/ExplorarLojasMapa.vue'
import { useApiError } from '@/composables/useApiError'
import { useGeolocation } from '@/composables/useGeolocation'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import {
  createDefaultExplorarFiltros,
  EXPLORAR_DEFAULT_CENTER,
  EXPLORAR_NOTA_MIN_OPTIONS,
  EXPLORAR_RAIO_KM_OPTIONS,
  type ExplorarLojasFiltros,
} from '@/constants/explorarLojas'
import { LANDING_SECTIONS } from '@/constants/landing'
import { STORY_CHAPTERS } from '@/constants/showcaseCallouts'
import { publicoService } from '@/services/publicoService'
import type {
  EstabelecimentoCategoria,
  EstabelecimentoProximo,
} from '@/types/estabelecimento.types'
import { formatDistanciaKm } from '@/utils/formatters'

const props = withDefaults(
  defineProps<{
    /** `page` = tela dedicada; `section` = bloco embutido (legado). */
    variant?: 'page' | 'section'
  }>(),
  { variant: 'page' },
)

const { isVisible } = useRevealOnScroll()
const chapter = STORY_CHAPTERS.explorar
const isPage = computed(() => props.variant === 'page')
const { resolveError } = useApiError()
const {
  coords,
  loading: geoLoading,
  errorMessage: geoError,
  request: requestGeo,
} = useGeolocation()

const filtros = ref<ExplorarLojasFiltros>(createDefaultExplorarFiltros())
const busca = ref('')
const buscaAberta = ref(false)
const filtrosAbertos = ref(false)

const itens = ref<EstabelecimentoProximo[]>([])
const categorias = ref<EstabelecimentoCategoria[]>([])
const cidade = ref('')
const estado = ref('')
const total = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)
const usedFallbackLocation = ref(false)

const selectedGuid = ref<string | null>(null)
const focusGuid = ref<string | null>(null)
const mapaRef = ref<InstanceType<typeof ExplorarLojasMapa> | null>(null)
const queryCenter = ref<{ latitude: number; longitude: number } | null>(null)
const mapMounted = ref(false)

const userLat = computed(() => coords.value?.latitude ?? null)
const userLng = computed(() => coords.value?.longitude ?? null)
const userAccuracy = computed(() => coords.value?.accuracy ?? null)

const bootstrapLat = computed(
  () => queryCenter.value?.latitude ?? EXPLORAR_DEFAULT_CENTER.latitude,
)
const bootstrapLng = computed(
  () => queryCenter.value?.longitude ?? EXPLORAR_DEFAULT_CENTER.longitude,
)

const localLabel = computed(() => {
  if (cidade.value && estado.value) return `${cidade.value}, ${estado.value}`
  if (usedFallbackLocation.value) return EXPLORAR_DEFAULT_CENTER.label
  return 'Sua região'
})

const itensFiltrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  const notaMin = filtros.value.notaMinima
  return itens.value.filter((item) => {
    if (notaMin > 0 && (item.notaMedia ?? 0) < notaMin) return false
    if (!q) return true
    const hay = [
      item.nome,
      item.categoria ?? '',
      item.endereco?.logradouro ?? '',
      item.endereco?.bairro ?? '',
      item.endereco?.cidade ?? '',
      item.endereco?.estado ?? '',
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
})

const sugestoesBusca = computed(() => {
  const q = busca.value.trim().toLowerCase()
  if (q.length < 2) return []
  return itensFiltrados.value.slice(0, 6)
})

const filtrosAtivosCount = computed(() => {
  let n = 0
  if (filtros.value.categoriaId != null) n += 1
  if (filtros.value.raioKm !== 12) n += 1
  if (filtros.value.notaMinima > 0) n += 1
  if (filtros.value.apenasAbertos) n += 1
  return n
})

const categoriaModel = computed({
  get: () =>
    filtros.value.categoriaId == null ? '' : String(filtros.value.categoriaId),
  set: (value: string) => {
    filtros.value.categoriaId = value === '' ? null : Number(value)
  },
})

async function carregar(opts?: { latitude: number; longitude: number }) {
  const location =
    opts
    ?? queryCenter.value
    ?? (coords.value
      ? { latitude: coords.value.latitude, longitude: coords.value.longitude }
      : EXPLORAR_DEFAULT_CENTER)

  queryCenter.value = {
    latitude: location.latitude,
    longitude: location.longitude,
  }

  loading.value = true
  error.value = null
  try {
    const data = await publicoService.listarProximos({
      latitude: location.latitude,
      longitude: location.longitude,
      raioKm: filtros.value.raioKm,
      pagina: 1,
      tamanhoPagina: 50,
      categoriaId: filtros.value.categoriaId ?? undefined,
    })
    cidade.value = data.cidade
    estado.value = data.estado
    total.value = data.total
    itens.value = data.itens

    if (
      selectedGuid.value
      && !data.itens.some((i) => i.publicGuid === selectedGuid.value)
    ) {
      selectedGuid.value = null
    }
  } catch (err) {
    error.value = resolveError(err, 'Não foi possível carregar estabelecimentos.')
  } finally {
    loading.value = false
  }
}

async function carregarCategorias() {
  try {
    categorias.value = await publicoService.listarCategorias()
  } catch {
    categorias.value = []
  }
}

async function bootstrapLocation() {
  const location = await requestGeo()
  if (location) {
    usedFallbackLocation.value = false
    await carregar(location)
    mapaRef.value?.recenterUser()
    return
  }
  usedFallbackLocation.value = true
  await carregar(EXPLORAR_DEFAULT_CENTER)
}

function onBoundsChange(payload: { latitude: number; longitude: number }) {
  void carregar(payload)
}

function selecionarSugestao(item: EstabelecimentoProximo) {
  busca.value = item.nome
  buscaAberta.value = false
  focusGuid.value = item.publicGuid
  selectedGuid.value = item.publicGuid
  // re-trigger focus watch
  requestAnimationFrame(() => {
    focusGuid.value = item.publicGuid
  })
}

function limparFiltros() {
  filtros.value = createDefaultExplorarFiltros()
}

watch(
  () => [filtros.value.categoriaId, filtros.value.raioKm] as const,
  () => {
    if (!mapMounted.value) return
    void carregar()
  },
)

onMounted(async () => {
  mapMounted.value = true
  await Promise.all([carregarCategorias(), bootstrapLocation()])
})
</script>

<template>
  <LandingStorySection
    :id="LANDING_SECTIONS.explorarLojas"
    tone="dark"
    :chapter-index="isPage ? undefined : chapter.index"
    :chapter-label="isPage ? undefined : chapter.label"
    :show-progress="!isPage"
  >
    <div
      class="px-4 lg:px-8"
      :class="isPage ? 'pb-10 pt-2 lg:pb-12' : 'pb-20 pt-4 lg:pb-28 lg:pt-6'"
    >
      <div class="mx-auto max-w-[1280px]">
        <div
          ref="revealRoot"
          class="landing-stagger"
          :class="isVisible && 'is-visible'"
        >
          <LandingSectionHeader
            tone="dark"
            eyebrow="Rede ao vivo"
            title="Explore lojas"
            highlight="perto de você"
            subtitle="Mapa interativo com barbearias e salões reais da plataforma — escolha, veja detalhes e agende sem criar conta."
          />
        </div>

        <div
          class="explorar-lojas-shell"
          :class="isPage ? 'mt-8 lg:mt-10' : 'mt-10 lg:mt-14'"
        >
          <div class="explorar-lojas-shell__chrome">
            <div class="explorar-lojas-shell__meta">
              <p class="explorar-lojas-shell__local">
                <span class="explorar-lojas-shell__pulse" aria-hidden="true" />
                {{ localLabel }}
              </p>
              <p class="explorar-lojas-shell__count">
                <template v-if="loading || geoLoading">Buscando estabelecimentos…</template>
                <template v-else>
                  {{ itensFiltrados.length }}
                  {{ itensFiltrados.length === 1 ? 'loja' : 'lojas' }}
                  <span v-if="total > itensFiltrados.length" class="text-white/35">
                    · {{ total }} na área
                  </span>
                </template>
              </p>
            </div>

            <div class="explorar-lojas-shell__tools">
              <div class="explorar-lojas-search">
                <svg
                  class="explorar-lojas-search__icon"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.4" />
                  <path
                    d="M13.5 13.5 17 17"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                  />
                </svg>
                <input
                  v-model="busca"
                  type="search"
                  class="explorar-lojas-search__input"
                  placeholder="Buscar por nome, cidade, bairro…"
                  autocomplete="off"
                  aria-label="Buscar estabelecimentos"
                  @focus="buscaAberta = true"
                  @blur="buscaAberta = false"
                />
                <ul
                  v-if="buscaAberta && sugestoesBusca.length > 0"
                  class="explorar-lojas-search__dropdown"
                  role="listbox"
                >
                  <li v-for="item in sugestoesBusca" :key="item.publicGuid">
                    <button
                      type="button"
                      class="explorar-lojas-search__option"
                      @mousedown.prevent="selecionarSugestao(item)"
                    >
                      <span class="font-semibold text-white">{{ item.nome }}</span>
                      <span class="text-white/45">
                        {{ item.endereco?.bairro || item.endereco?.cidade }}
                        · {{ formatDistanciaKm(item.distanciaKm) }}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>

              <div class="explorar-lojas-filters-desktop hidden lg:flex">
                <select
                  v-model="categoriaModel"
                  class="explorar-lojas-select"
                  aria-label="Categoria"
                >
                  <option value="">Todas as categorias</option>
                  <option
                    v-for="cat in categorias"
                    :key="cat.id"
                    :value="String(cat.id)"
                  >
                    {{ cat.nome }}
                  </option>
                </select>

                <select
                  v-model.number="filtros.raioKm"
                  class="explorar-lojas-select"
                  aria-label="Distância"
                >
                  <option
                    v-for="raio in EXPLORAR_RAIO_KM_OPTIONS"
                    :key="raio"
                    :value="raio"
                  >
                    Até {{ raio }} km
                  </option>
                </select>

                <select
                  v-model.number="filtros.notaMinima"
                  class="explorar-lojas-select"
                  aria-label="Avaliação mínima"
                >
                  <option
                    v-for="opt in EXPLORAR_NOTA_MIN_OPTIONS"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <button
                type="button"
                class="explorar-lojas-chip lg:hidden"
                :aria-expanded="filtrosAbertos"
                @click="filtrosAbertos = true"
              >
                Filtros
                <span
                  v-if="filtrosAtivosCount > 0"
                  class="explorar-lojas-chip__badge"
                >
                  {{ filtrosAtivosCount }}
                </span>
              </button>

              <button
                type="button"
                class="explorar-lojas-locate"
                :disabled="geoLoading"
                title="Usar minha localização"
                @click="bootstrapLocation"
              >
                <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
                  <path
                    d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="hidden sm:inline">Minha localização</span>
              </button>
            </div>

            <p v-if="geoError && usedFallbackLocation" class="explorar-lojas-shell__hint">
              {{ geoError }}
            </p>
            <p v-if="error" class="explorar-lojas-shell__error">{{ error }}</p>
          </div>

          <div class="explorar-lojas-shell__stage">
            <div
              class="explorar-lojas-shell__frame"
              :class="{ 'explorar-lojas-shell__frame--page': isPage }"
            >
              <ExplorarLojasMapa
                ref="mapaRef"
                v-model:selected-guid="selectedGuid"
                :itens="itensFiltrados"
                :user-lat="userLat"
                :user-lng="userLng"
                :user-accuracy="userAccuracy"
                :focus-guid="focusGuid"
                :bootstrap-lat="bootstrapLat"
                :bootstrap-lng="bootstrapLng"
                @bounds-change="onBoundsChange"
              />

              <div
                v-if="loading && itens.length === 0"
                class="explorar-lojas-shell__loading"
              >
                <span class="explorar-lojas-shell__spinner" aria-hidden="true" />
                Carregando mapa…
              </div>

              <div
                v-else-if="!loading && itensFiltrados.length === 0"
                class="explorar-lojas-shell__empty"
              >
                <p class="font-satoshi text-base font-semibold text-white">
                  Nenhuma loja nesta área
                </p>
                <p class="mt-1 font-poppins text-sm font-light text-white/50">
                  Amplie o raio, limpe os filtros ou mova o mapa para outra região.
                </p>
                <button
                  type="button"
                  class="explorar-lojas-chip mt-4"
                  @click="limparFiltros"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Painel de filtros (mobile) -->
    <Teleport to="body">
      <div
        v-if="filtrosAbertos"
        class="explorar-lojas-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="explorar-filtros-title"
      >
        <button
          type="button"
          class="explorar-lojas-sheet__backdrop"
          aria-label="Fechar filtros"
          @click="filtrosAbertos = false"
        />
        <div class="explorar-lojas-sheet__panel">
          <div class="flex items-center justify-between gap-3">
            <h3
              id="explorar-filtros-title"
              class="font-satoshi text-lg font-semibold text-white"
            >
              Filtros
            </h3>
            <button
              type="button"
              class="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"
              aria-label="Fechar"
              @click="filtrosAbertos = false"
            >
              <svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <label class="explorar-lojas-sheet__field">
            <span>Categoria</span>
            <select v-model="categoriaModel" class="explorar-lojas-select w-full">
              <option value="">Todas as categorias</option>
              <option v-for="cat in categorias" :key="cat.id" :value="String(cat.id)">
                {{ cat.nome }}
              </option>
            </select>
          </label>

          <label class="explorar-lojas-sheet__field">
            <span>Distância</span>
            <select v-model.number="filtros.raioKm" class="explorar-lojas-select w-full">
              <option
                v-for="raio in EXPLORAR_RAIO_KM_OPTIONS"
                :key="raio"
                :value="raio"
              >
                Até {{ raio }} km
              </option>
            </select>
          </label>

          <label class="explorar-lojas-sheet__field">
            <span>Avaliação</span>
            <select v-model.number="filtros.notaMinima" class="explorar-lojas-select w-full">
              <option
                v-for="opt in EXPLORAR_NOTA_MIN_OPTIONS"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </label>

          <label class="explorar-lojas-sheet__check">
            <input v-model="filtros.apenasAbertos" type="checkbox" class="rounded border-white/20" />
            <span>Apenas abertos agora <em>(em breve)</em></span>
          </label>

          <div class="mt-6 flex gap-3">
            <button type="button" class="explorar-lojas-chip flex-1" @click="limparFiltros">
              Limpar
            </button>
            <button
              type="button"
              class="explorar-lojas-locate flex-1 justify-center"
              @click="filtrosAbertos = false"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </LandingStorySection>
</template>

<style scoped>
.explorar-lojas-shell {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.explorar-lojas-shell__chrome {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  border-radius: 1.5rem;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: linear-gradient(
    160deg,
    rgb(255 255 255 / 0.06),
    rgb(255 255 255 / 0.02)
  );
  padding: 1rem 1rem 1.1rem;
  backdrop-filter: blur(12px);
}

@media (min-width: 1024px) {
  .explorar-lojas-shell__chrome {
    padding: 1.15rem 1.35rem 1.25rem;
  }
}

.explorar-lojas-shell__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 1rem;
}

.explorar-lojas-shell__local {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.explorar-lojas-shell__pulse {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 9999px;
  background: #6ee7b7;
  box-shadow: 0 0 0 0 rgb(110 231 183 / 0.55);
  animation: explorar-pulse 2s ease-out infinite;
}

@keyframes explorar-pulse {
  70% {
    box-shadow: 0 0 0 10px rgb(110 231 183 / 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgb(110 231 183 / 0);
  }
}

.explorar-lojas-shell__count {
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.8rem;
  color: rgb(255 255 255 / 0.5);
}

.explorar-lojas-shell__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
}

.explorar-lojas-search {
  position: relative;
  flex: 1 1 14rem;
  min-width: 0;
}

.explorar-lojas-search__icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  width: 1rem;
  height: 1rem;
  transform: translateY(-50%);
  color: rgb(255 255 255 / 0.4);
  pointer-events: none;
}

.explorar-lojas-search__input {
  width: 100%;
  height: 2.65rem;
  border-radius: 0.9rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  background: rgb(13 8 37 / 0.55);
  padding: 0 0.9rem 0 2.35rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.875rem;
  color: #fff;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.explorar-lojas-search__input::placeholder {
  color: rgb(255 255 255 / 0.35);
}

.explorar-lojas-search__input:focus {
  border-color: rgb(201 162 39 / 0.45);
  box-shadow: 0 0 0 3px rgb(201 162 39 / 0.12);
}

.explorar-lojas-search__dropdown {
  position: absolute;
  z-index: 40;
  left: 0;
  right: 0;
  top: calc(100% + 0.35rem);
  margin: 0;
  list-style: none;
  padding: 0.35rem;
  border-radius: 0.9rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  background: rgb(22 14 51 / 0.98);
  box-shadow: 0 18px 40px -20px rgb(0 0 0 / 0.7);
}

.explorar-lojas-search__option {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  border-radius: 0.65rem;
  padding: 0.55rem 0.7rem;
  text-align: left;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.8rem;
  transition: background 0.15s ease;
}

.explorar-lojas-search__option:hover {
  background: rgb(255 255 255 / 0.06);
}

.explorar-lojas-filters-desktop {
  align-items: center;
  gap: 0.45rem;
}

.explorar-lojas-select {
  height: 2.65rem;
  border-radius: 0.9rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  background: rgb(13 8 37 / 0.55);
  padding: 0 2rem 0 0.85rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.8rem;
  color: #fff;
  outline: none;
}

.explorar-lojas-chip,
.explorar-lojas-locate {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 2.65rem;
  border-radius: 0.9rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  background: rgb(255 255 255 / 0.05);
  padding: 0 0.95rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;
}

.explorar-lojas-chip:hover,
.explorar-lojas-locate:hover:not(:disabled) {
  background: rgb(255 255 255 / 0.09);
  border-color: rgb(201 162 39 / 0.35);
}

.explorar-lojas-locate {
  background: color-mix(in srgb, var(--glow-gold) 16%, transparent);
  border-color: color-mix(in srgb, var(--glow-gold) 35%, transparent);
  color: var(--glow-gold);
}

.explorar-lojas-locate:disabled {
  opacity: 0.55;
  cursor: wait;
}

.explorar-lojas-chip__badge {
  display: inline-grid;
  place-items: center;
  min-width: 1.15rem;
  height: 1.15rem;
  border-radius: 9999px;
  background: var(--glow-gold);
  color: #0d0825;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0 0.25rem;
}

.explorar-lojas-shell__hint,
.explorar-lojas-shell__error {
  margin: 0;
  font-family: Poppins, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 300;
}

.explorar-lojas-shell__hint {
  color: rgb(255 255 255 / 0.45);
}

.explorar-lojas-shell__error {
  color: #fca5a5;
}

.explorar-lojas-shell__stage {
  position: relative;
}

.explorar-lojas-shell__frame {
  position: relative;
  height: min(72vh, 640px);
  min-height: 420px;
  overflow: hidden;
  border-radius: 1.75rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  box-shadow:
    0 40px 80px -40px rgb(0 0 0 / 0.75),
    inset 0 1px 0 rgb(255 255 255 / 0.06);
  background: #120a2a;
}

@media (min-width: 1024px) {
  .explorar-lojas-shell__frame {
    height: min(78vh, 720px);
  }

  .explorar-lojas-shell__frame--page {
    height: min(calc(100vh - 14rem), 820px);
  }
}

.explorar-lojas-shell__loading,
.explorar-lojas-shell__empty {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 0.5rem;
  background: rgb(13 8 37 / 0.55);
  backdrop-filter: blur(4px);
  text-align: center;
  padding: 1.5rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  color: rgb(255 255 255 / 0.7);
}

.explorar-lojas-shell__spinner {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  border: 2px solid rgb(255 255 255 / 0.15);
  border-top-color: var(--glow-gold);
  animation: explorar-spin 0.8s linear infinite;
}

@keyframes explorar-spin {
  to {
    transform: rotate(360deg);
  }
}

.explorar-lojas-sheet {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.explorar-lojas-sheet__backdrop {
  position: absolute;
  inset: 0;
  border: none;
  background: rgb(0 0 0 / 0.55);
  backdrop-filter: blur(4px);
}

.explorar-lojas-sheet__panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 28rem;
  border-radius: 1.5rem 1.5rem 0 0;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-bottom: none;
  background: #160e33;
  padding: 1.25rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom));
  animation: explorar-sheet-up 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes explorar-sheet-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.explorar-lojas-sheet__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 1rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.55);
}

.explorar-lojas-sheet__check {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1.1rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.85rem;
  color: rgb(255 255 255 / 0.75);
}

.explorar-lojas-sheet__check em {
  font-style: normal;
  color: rgb(255 255 255 / 0.35);
  font-size: 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
  .explorar-lojas-shell__pulse,
  .explorar-lojas-shell__spinner,
  .explorar-lojas-sheet__panel {
    animation: none !important;
  }
}
</style>
