<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
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
import { lojaPublicaPath } from '@/constants/routes'
import { publicoService } from '@/services/publicoService'
import type {
  EstabelecimentoCategoria,
  EstabelecimentoProximo,
} from '@/types/estabelecimento.types'
import { FEATURE_FLAGS } from '@/config/features'
import {
  placeholderBuscaMarketplace,
  rotuloMarketplace,
  tipoAssinaturaParaCategorias,
  tituloMarketplace,
  vazioMarketplace,
  visivelNoMarketplace,
} from '@/utils/tipoAssinatura'
import { formatDistanciaKm } from '@/utils/formatters'

const props = withDefaults(
  defineProps<{
    /** `page` = tela dedicada imersiva; `section` = bloco embutido. */
    variant?: 'page' | 'section'
  }>(),
  { variant: 'page' },
)

const { isVisible } = useRevealOnScroll()
const chapter = STORY_CHAPTERS.explorar
const isPage = computed(() => props.variant === 'page')
const router = useRouter()
const { resolveError } = useApiError()
const {
  coords,
  loading: geoLoading,
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
  const visiveis = itens.value.filter(visivelNoMarketplace)
  const q = busca.value.trim().toLowerCase()
  const notaMin = filtros.value.notaMinima
  return visiveis.filter((item) => {
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

const statusLabel = computed(() => {
  if (loading.value || geoLoading.value) return 'Buscando…'
  const n = itensFiltrados.value.length
  return `${n} ${rotuloMarketplace(n)}`
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
    const status =
      err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { status?: number } }).response?.status
        : undefined
    error.value =
      status != null && status >= 500
        ? 'Serviço temporariamente indisponível. Tente novamente em instantes.'
        : resolveError(
            err,
            'Não foi possível carregar estabelecimentos. Tente novamente em instantes.',
          )
    itens.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

async function carregarCategorias() {
  try {
    categorias.value = await publicoService.listarCategorias(tipoAssinaturaParaCategorias())
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
  void router.push(lojaPublicaPath(item.publicGuid))
}

function abrirLoja(publicGuid: string) {
  void router.push(lojaPublicaPath(publicGuid))
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
  await nextTick()
  mapaRef.value?.invalidateSize()
})
</script>

<template>
  <!-- ========== Página imersiva (referência PDX Shootings) ========== -->
  <section
    v-if="isPage"
    :id="LANDING_SECTIONS.explorarLojas"
    class="explorar-immersive"
    aria-label="Explorar profissionais no mapa"
  >
    <div class="explorar-immersive__stage">
      <ExplorarLojasMapa
        ref="mapaRef"
        v-model:selected-guid="selectedGuid"
        immersive
        :itens="itensFiltrados"
        :user-lat="userLat"
        :user-lng="userLng"
        :user-accuracy="userAccuracy"
        :focus-guid="focusGuid"
        :bootstrap-lat="bootstrapLat"
        :bootstrap-lng="bootstrapLng"
        @bounds-change="onBoundsChange"
        @select-loja="abrirLoja"
      />

      <!-- Top chrome (estilo PDX) -->
      <header class="explorar-pdx__top">
        <div class="explorar-pdx__search-wrap">
          <RouterLink :to="'/'" class="explorar-pdx__brand" aria-label="Glow Up Connect, início">
            <span class="font-light">GlowUp</span>
            <span class="font-black">Connect</span>
          </RouterLink>
          <div class="explorar-pdx__search">
            <svg class="explorar-pdx__search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.4" />
              <path d="M13.5 13.5 17 17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
            </svg>
            <input
              v-model="busca"
              type="search"
              class="explorar-pdx__search-input"
              :placeholder="placeholderBuscaMarketplace()"
              autocomplete="off"
              aria-label="Buscar lojas e profissionais"
              @focus="buscaAberta = true"
              @blur="buscaAberta = false"
            />
            <ul
              v-if="buscaAberta && sugestoesBusca.length > 0"
              class="explorar-pdx__dropdown"
              role="listbox"
            >
              <li v-for="item in sugestoesBusca" :key="item.publicGuid">
                <button
                  type="button"
                  class="explorar-pdx__option"
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
        </div>

        <p class="explorar-pdx__status">
          <span class="explorar-pdx__status-label">Exibindo:</span>
          {{ localLabel }}
          <span class="explorar-pdx__status-sep">·</span>
          <strong>{{ tituloMarketplace() }}: {{ loading || geoLoading ? '…' : itensFiltrados.length }}</strong>
        </p>

        <div class="explorar-pdx__actions">
          <button
            type="button"
            class="explorar-pdx__square"
            :class="{ 'explorar-pdx__square--active': filtrosAbertos }"
            :aria-expanded="filtrosAbertos"
            title="Filtros"
            aria-label="Abrir filtros"
            @click="filtrosAbertos = !filtrosAbertos"
          >
            <svg class="size-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6h16M7 12h10M10 18h4"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
            <span v-if="filtrosAtivosCount > 0" class="explorar-pdx__badge">{{ filtrosAtivosCount }}</span>
          </button>
          <button
            type="button"
            class="explorar-pdx__square"
            :disabled="geoLoading"
            title="Minha localização"
            aria-label="Usar minha localização"
            @click="bootstrapLocation"
          >
            <svg class="size-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
              <path
                d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <RouterLink
            :to="'/'"
            class="explorar-pdx__square"
            title="Voltar ao início"
            aria-label="Voltar ao início"
          >
            <svg class="size-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
          </RouterLink>
        </div>
      </header>

      <p v-if="error" class="explorar-pdx__alert" role="alert">{{ error }}</p>

      <div v-if="loading && itens.length === 0" class="explorar-pdx__toast">
        <span class="explorar-pdx__spinner" aria-hidden="true" />
        Carregando mapa…
      </div>

      <div
        v-else-if="!loading && !error && itensFiltrados.length === 0"
        class="explorar-pdx__toast explorar-pdx__toast--panel"
      >
        <p class="text-sm font-semibold text-white">
          {{ vazioMarketplace() }}
        </p>
        <p class="mt-1 text-xs text-white/50">Amplie o raio ou mova o mapa.</p>
        <button type="button" class="explorar-pdx__link-btn mt-2" @click="limparFiltros">
          Limpar filtros
        </button>
      </div>

      <!-- Dock inferior de filtros (estilo PDX) -->
      <Transition name="explorar-dock">
        <aside
          v-if="filtrosAbertos"
          class="explorar-pdx__dock"
          aria-labelledby="explorar-filtros-title"
        >
          <div class="explorar-pdx__dock-head">
            <h2 id="explorar-filtros-title" class="explorar-pdx__dock-title">Filtros</h2>
            <button
              type="button"
              class="explorar-pdx__square"
              aria-label="Fechar filtros"
              @click="filtrosAbertos = false"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="explorar-pdx__dock-grid">
            <label class="explorar-pdx__field">
              <span>Categoria</span>
              <select v-model="categoriaModel" class="explorar-pdx__select">
                <option value="">Todas</option>
                <option v-for="cat in categorias" :key="cat.id" :value="String(cat.id)">
                  {{ cat.nome }}
                </option>
              </select>
            </label>
            <label class="explorar-pdx__field">
              <span>Distância</span>
              <select v-model.number="filtros.raioKm" class="explorar-pdx__select">
                <option v-for="raio in EXPLORAR_RAIO_KM_OPTIONS" :key="raio" :value="raio">
                  Até {{ raio }} km
                </option>
              </select>
            </label>
            <label class="explorar-pdx__field">
              <span>Avaliação</span>
              <select v-model.number="filtros.notaMinima" class="explorar-pdx__select">
                <option v-for="opt in EXPLORAR_NOTA_MIN_OPTIONS" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </label>
            <div class="explorar-pdx__dock-actions">
              <button type="button" class="explorar-pdx__ghost" @click="limparFiltros">Limpar</button>
              <button type="button" class="explorar-pdx__primary" @click="filtrosAbertos = false">
                Aplicar
              </button>
            </div>
          </div>
        </aside>
      </Transition>
    </div>
  </section>

  <!-- ========== Variante seção (legado / embutida) ========== -->
  <LandingStorySection
    v-else
    :id="LANDING_SECTIONS.explorarLojas"
    tone="dark"
    :chapter-index="chapter.index"
    :chapter-label="chapter.label"
  >
    <div class="px-4 pb-20 pt-4 lg:px-8 lg:pb-28 lg:pt-6">
      <div class="mx-auto max-w-[1280px]">
        <div
          ref="revealRoot"
          class="landing-stagger"
          :class="isVisible && 'is-visible'"
        >
          <LandingSectionHeader
            tone="dark"
            eyebrow="Rede ao vivo"
            title="Explore lojas e profissionais"
            highlight="perto de você"
            :subtitle="
              FEATURE_FLAGS.lojasHabilitadas
                ? 'Mapa interativo com barbearias, salões e profissionais autônomos da plataforma.'
                : 'Mapa interativo com profissionais autônomos da plataforma.'
            "
          />
        </div>

        <div class="explorar-lojas-shell mt-10 lg:mt-14">
          <div class="explorar-lojas-shell__chrome">
            <div class="explorar-lojas-shell__meta">
              <p class="explorar-lojas-shell__local">
                <span class="explorar-lojas-shell__pulse" aria-hidden="true" />
                {{ localLabel }}
              </p>
              <p class="explorar-lojas-shell__count">{{ statusLabel }}</p>
            </div>
            <div class="explorar-lojas-shell__tools">
              <div class="explorar-lojas-search">
                <input
                  v-model="busca"
                  type="search"
                  class="explorar-lojas-search__input pl-4"
                  placeholder="Buscar…"
                  @focus="buscaAberta = true"
                  @blur="buscaAberta = false"
                />
              </div>
              <button
                type="button"
                class="explorar-lojas-locate"
                :disabled="geoLoading"
                @click="bootstrapLocation"
              >
                Minha localização
              </button>
            </div>
          </div>
          <div class="explorar-lojas-shell__stage">
            <div class="explorar-lojas-shell__frame">
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
                @select-loja="abrirLoja"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>

<style scoped>
/* —— PDX-style immersive map —— */
.explorar-immersive {
  position: relative;
  height: 100%;
  min-height: 100dvh;
}

.explorar-immersive__stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--glow-canvas);
}

.explorar-pdx__top {
  position: absolute;
  z-index: 650;
  top: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.55rem 0.75rem;
  align-items: center;
  padding: 0.65rem 0.75rem;
  background: linear-gradient(180deg, rgb(0 0 0 / 0.72), rgb(0 0 0 / 0.28) 70%, transparent);
  pointer-events: none;
}

.explorar-pdx__top > * {
  pointer-events: auto;
}

@media (min-width: 900px) {
  .explorar-pdx__top {
    grid-template-columns: minmax(14rem, 22rem) minmax(0, 1fr) auto;
    padding: 0.75rem 1rem;
  }
}

.explorar-pdx__search-wrap {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.explorar-pdx__brand {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: baseline;
  gap: 0.15rem;
  max-width: 7.5rem;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
  line-height: 1.1;
}

@media (min-width: 640px) {
  .explorar-pdx__brand {
    max-width: none;
    font-size: 0.9rem;
  }
}

.explorar-pdx__search {
  position: relative;
  flex: 1;
  min-width: 0;
}

.explorar-pdx__search-icon {
  position: absolute;
  left: 0.7rem;
  top: 50%;
  width: 0.9rem;
  height: 0.9rem;
  transform: translateY(-50%);
  color: rgb(255 255 255 / 0.45);
  pointer-events: none;
}

.explorar-pdx__search-input {
  width: 100%;
  height: 2.15rem;
  border: 1px solid rgb(255 255 255 / 0.24);
  border-radius: 3px;
  background: rgb(0 0 0 / 0.45);
  padding: 0 0.7rem 0 2rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.82rem;
  color: rgb(255 255 255 / 0.9);
  outline: none;
}

.explorar-pdx__search-input:focus {
  border-color: var(--glow-gold-cta);
}

.explorar-pdx__search-input::placeholder {
  color: rgb(255 255 255 / 0.35);
}

.explorar-pdx__dropdown {
  position: absolute;
  z-index: 40;
  left: 0;
  right: 0;
  top: calc(100% + 0.35rem);
  margin: 0;
  list-style: none;
  padding: 0.3rem;
  border: 1px solid rgb(255 255 255 / 0.18);
  border-radius: 4px;
  background: rgb(18 18 18 / 0.96);
  box-shadow: 0 16px 36px -18px rgb(0 0 0 / 0.8);
}

.explorar-pdx__option {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.05rem;
  border-radius: 3px;
  padding: 0.45rem 0.55rem;
  text-align: left;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
}

.explorar-pdx__option:hover {
  background: rgb(255 255 255 / 0.06);
}

.explorar-pdx__status {
  display: none;
  margin: 0;
  text-align: center;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.82rem;
  color: rgb(255 255 255 / 0.82);
}

.explorar-pdx__status-label {
  color: rgb(255 255 255 / 0.45);
  margin-right: 0.25rem;
}

.explorar-pdx__status-sep {
  margin: 0 0.35rem;
  color: rgb(255 255 255 / 0.3);
}

.explorar-pdx__status strong {
  font-weight: 700;
  color: #fff;
}

@media (min-width: 900px) {
  .explorar-pdx__status {
    display: block;
  }
}

.explorar-pdx__actions {
  display: flex;
  justify-self: end;
  gap: 0.4rem;
}

.explorar-pdx__square {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.15rem;
  height: 2.15rem;
  border: 1px solid rgb(255 255 255 / 0.24);
  border-radius: 3px;
  background: transparent;
  color: rgb(255 255 255 / 0.82);
  text-decoration: none;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.explorar-pdx__square:hover:not(:disabled),
.explorar-pdx__square--active {
  color: var(--glow-gold-cta);
  border-color: var(--glow-gold-cta);
}

.explorar-pdx__square:disabled {
  opacity: 0.45;
  cursor: wait;
}

.explorar-pdx__badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  min-width: 0.95rem;
  height: 0.95rem;
  border-radius: 9999px;
  background: #63e2b7;
  color: var(--glow-canvas);
  font-size: 0.58rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  padding: 0 0.15rem;
}

.explorar-pdx__alert {
  position: absolute;
  z-index: 640;
  top: 3.4rem;
  left: 50%;
  transform: translateX(-50%);
  width: min(36rem, calc(100% - 1.5rem));
  margin: 0;
  border: 1px solid rgb(252 165 165 / 0.35);
  border-radius: 3px;
  background: rgb(0 0 0 / 0.72);
  padding: 0.45rem 0.75rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
  color: #fecaca;
  text-align: center;
}

.explorar-pdx__toast {
  position: absolute;
  z-index: 640;
  left: 50%;
  bottom: 1.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transform: translateX(-50%);
  border: 1px solid rgb(255 255 255 / 0.18);
  border-radius: 9999px;
  background: rgb(0 0 0 / 0.78);
  padding: 0.55rem 0.9rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  color: rgb(255 255 255 / 0.85);
}

.explorar-pdx__toast--panel {
  flex-direction: column;
  align-items: flex-start;
  border-radius: 6px;
  bottom: 5.5rem;
}

.explorar-pdx__spinner {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 9999px;
  border: 2px solid rgb(255 255 255 / 0.15);
  border-top-color: #63e2b7;
  animation: explorar-spin 0.8s linear infinite;
}

@keyframes explorar-spin {
  to { transform: rotate(360deg); }
}

.explorar-pdx__link-btn {
  border: none;
  background: transparent;
  color: #7fe7c4;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0;
  cursor: pointer;
}

.explorar-pdx__dock {
  position: absolute;
  z-index: 660;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: 1px solid rgb(255 255 255 / 0.14);
  background: rgb(18 18 18 / 0.94);
  backdrop-filter: blur(10px);
  padding: 0.85rem 1rem calc(0.85rem + env(safe-area-inset-bottom));
}

.explorar-pdx__dock-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.explorar-pdx__dock-title {
  margin: 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
}

.explorar-pdx__dock-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 720px) {
  .explorar-pdx__dock-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
    align-items: end;
  }
}

.explorar-pdx__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.55);
}

.explorar-pdx__select {
  height: 2.15rem;
  border: 1px solid rgb(255 255 255 / 0.24);
  border-radius: 3px;
  background: rgb(0 0 0 / 0.35);
  padding: 0 1.75rem 0 0.7rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.82rem;
  color: rgb(255 255 255 / 0.9);
  outline: none;
}

.explorar-pdx__select:focus {
  border-color: var(--glow-gold-cta);
}

.explorar-pdx__dock-actions {
  display: flex;
  gap: 0.45rem;
  align-items: center;
}

.explorar-pdx__ghost,
.explorar-pdx__primary {
  height: 2.15rem;
  border-radius: 3px;
  padding: 0 0.9rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.explorar-pdx__ghost {
  border: 1px solid rgb(255 255 255 / 0.24);
  background: transparent;
  color: rgb(255 255 255 / 0.85);
}

.explorar-pdx__primary {
  border: none;
  background: var(--glow-gold-cta);
  color: var(--glow-canvas);
}

.explorar-dock-enter-active,
.explorar-dock-leave-active {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease;
}

.explorar-dock-enter-from,
.explorar-dock-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@media (prefers-reduced-motion: reduce) {
  .explorar-pdx__spinner,
  .explorar-dock-enter-active,
  .explorar-dock-leave-active {
    animation: none !important;
    transition: none !important;
  }
}

/* section variant leftovers */
.explorar-lojas-shell__chrome {
  border-radius: 1.5rem;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.04);
  padding: 1rem;
}

.explorar-lojas-shell__meta {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.explorar-lojas-shell__local,
.explorar-lojas-shell__count {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
}

.explorar-lojas-shell__pulse {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
  background: #6ee7b7;
}

.explorar-lojas-shell__tools {
  display: flex;
  gap: 0.5rem;
}

.explorar-lojas-search {
  flex: 1;
}

.explorar-lojas-search__input,
.explorar-lojas-locate {
  height: 2.5rem;
  border-radius: 0.85rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  background: rgb(13 8 37 / 0.55);
  color: #fff;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.85rem;
}

.explorar-lojas-locate {
  padding: 0 0.9rem;
  font-weight: 600;
}

.explorar-lojas-shell__frame {
  position: relative;
  margin-top: 1rem;
  height: min(60vh, 520px);
  min-height: 360px;
  overflow: hidden;
  border-radius: 1.5rem;
  border: 1px solid rgb(255 255 255 / 0.12);
}

@media (prefers-reduced-motion: reduce) {
  .explorar-immersive__toolbar,
  .explorar-immersive__pulse,
  .explorar-immersive__spinner {
    animation: none !important;
  }
}
</style>
