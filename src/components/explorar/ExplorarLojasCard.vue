<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ProfissionalPublico, ServicoPublico } from '@/types/agendamento.types'
import type { EstabelecimentoProximo, EstabelecimentoPublico } from '@/types/estabelecimento.types'
import { lojaAgendarPath } from '@/constants/routes'
import { publicoService } from '@/services/publicoService'
import { formatDistanciaKm, formatPrecoRange } from '@/utils/formatters'

const props = defineProps<{
  item: EstabelecimentoProximo
  userLat?: number | null
  userLng?: number | null
}>()

const emit = defineEmits<{
  close: []
}>()

const detalhe = ref<EstabelecimentoPublico | null>(null)
const loadingDetalhe = ref(false)
const profissionais = ref<ProfissionalPublico[]>([])
const servicos = ref<ServicoPublico[]>([])
const loadingCatalogo = ref(false)

const tituloId = computed(() => `explorar-loja-${props.item.publicGuid}`)

const notaLabel = computed(() => {
  const nota = detalhe.value?.notaMedia ?? props.item.notaMedia
  if (nota == null || nota <= 0) return 'Sem avaliações'
  return nota.toFixed(1).replace('.', ',')
})

const totalAvaliacoes = computed(
  () => detalhe.value?.totalAvaliacoes ?? props.item.totalAvaliacoes ?? 0,
)

const distanciaKm = computed(() => {
  const d = detalhe.value?.distanciaKm
  if (typeof d === 'number' && Number.isFinite(d)) return d
  return props.item.distanciaKm
})

const categoria = computed(
  () => detalhe.value?.categoria?.trim() || props.item.categoria?.trim() || null,
)

const descricao = computed(() => {
  const d = detalhe.value?.descricao?.trim() || props.item.descricao?.trim()
  return d || null
})

const horarioLabel = computed(() => {
  const d = detalhe.value
  if (!d) return null
  if (d.horarioAbertura && d.horarioFechamento) {
    const status = d.abertoAgora ? 'Aberto agora' : 'Fechado agora'
    return `${status} · ${d.horarioAbertura}–${d.horarioFechamento}`
  }
  if (d.abertoAgora != null) return d.abertoAgora ? 'Aberto agora' : 'Fechado agora'
  return null
})

const abertoAgora = computed(() => detalhe.value?.abertoAgora === true)

const enderecoLinhas = computed(() => {
  const e = detalhe.value?.endereco ?? props.item.endereco
  if (!e) return [] as string[]
  const linhas: string[] = []
  if (e.logradouro?.trim()) linhas.push(e.logradouro.trim())
  const bairroCidade = [e.bairro, e.cidade, e.estado].filter(Boolean).join(' · ')
  if (bairroCidade) linhas.push(bairroCidade)
  return linhas
})

async function carregarDetalhe(guid: string) {
  loadingDetalhe.value = true
  try {
    const params =
      props.userLat != null && props.userLng != null
        ? { latitude: props.userLat, longitude: props.userLng }
        : undefined
    detalhe.value = await publicoService.obterEstabelecimento(guid, params)
  } catch {
    detalhe.value = null
  } finally {
    loadingDetalhe.value = false
  }
}

async function carregarCatalogo(guid: string) {
  loadingCatalogo.value = true
  try {
    const [profs, svcs] = await Promise.all([
      publicoService.listarProfissionaisLoja(guid).catch(() => [] as ProfissionalPublico[]),
      publicoService.listarServicosLoja(guid).catch(() => [] as ServicoPublico[]),
    ])
    profissionais.value = profs
    servicos.value = svcs
  } finally {
    loadingCatalogo.value = false
  }
}

async function carregarTudo(guid: string) {
  await Promise.all([carregarDetalhe(guid), carregarCatalogo(guid)])
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeydown)
  void carregarTudo(props.item.publicGuid)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})

watch(
  () => props.item.publicGuid,
  (guid) => {
    profissionais.value = []
    servicos.value = []
    void carregarTudo(guid)
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      class="explorar-loja-modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="tituloId"
    >
      <button
        type="button"
        class="explorar-loja-modal__backdrop"
        aria-label="Fechar detalhes da loja"
        @click="emit('close')"
      />

      <div class="explorar-loja-modal__panel">
        <button
          type="button"
          class="explorar-loja-modal__close"
          aria-label="Fechar"
          @click="emit('close')"
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

        <div class="explorar-loja-modal__scroll">
          <div class="explorar-loja-modal__header">
            <div class="explorar-loja-modal__logo-wrap">
              <img
                v-if="item.logo"
                :src="item.logo"
                :alt="`Logo de ${item.nome}`"
                class="explorar-loja-modal__logo"
                loading="lazy"
                decoding="async"
              />
              <span v-else class="explorar-loja-modal__fallback" aria-hidden="true">
                {{ item.nome.charAt(0) }}
              </span>
            </div>

            <div class="explorar-loja-modal__heading">
              <span
                v-if="item.destaqueMarketplace"
                class="explorar-loja-modal__badge"
              >
                Destaque
              </span>
              <p v-if="categoria" class="explorar-loja-modal__categoria">{{ categoria }}</p>
              <h2 :id="tituloId" class="explorar-loja-modal__title">{{ item.nome }}</h2>

              <div class="explorar-loja-modal__chips">
                <span class="explorar-loja-modal__chip" aria-label="Avaliação">
                  <svg class="size-3.5 text-glow-gold" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path
                      d="M8 1.4 9.7 5.2l4.1.4-3.1 2.8.9 4-3.6-2.1L4.4 12.4l.9-4L2.2 5.6l4.1-.4L8 1.4Z"
                    />
                  </svg>
                  {{ notaLabel }}
                  <span v-if="totalAvaliacoes > 0" class="text-white/40">({{ totalAvaliacoes }})</span>
                </span>
                <span class="explorar-loja-modal__chip explorar-loja-modal__chip--muted">
                  {{ formatDistanciaKm(distanciaKm) }}
                </span>
              </div>
            </div>
          </div>

          <div class="explorar-loja-modal__content">
            <section v-if="enderecoLinhas.length" class="explorar-loja-modal__section">
              <h3 class="explorar-loja-modal__section-title">Endereço</h3>
              <p
                v-for="(linha, idx) in enderecoLinhas"
                :key="idx"
                class="explorar-loja-modal__text"
              >
                {{ linha }}
              </p>
            </section>

            <section class="explorar-loja-modal__section">
              <h3 class="explorar-loja-modal__section-title">Horário</h3>
              <p
                v-if="horarioLabel"
                class="explorar-loja-modal__horario"
                :class="{ 'explorar-loja-modal__horario--aberto': abertoAgora }"
              >
                {{ horarioLabel }}
              </p>
              <p v-else-if="loadingDetalhe" class="explorar-loja-modal__text explorar-loja-modal__text--muted">
                Carregando horário…
              </p>
              <p v-else class="explorar-loja-modal__text explorar-loja-modal__text--muted">
                Horário não informado.
              </p>
            </section>

            <section class="explorar-loja-modal__section">
              <h3 class="explorar-loja-modal__section-title">Sobre a loja</h3>
              <p v-if="loadingDetalhe && !descricao" class="explorar-loja-modal__text explorar-loja-modal__text--muted">
                Carregando detalhes…
              </p>
              <p v-else-if="descricao" class="explorar-loja-modal__desc">
                {{ descricao }}
              </p>
              <p v-else class="explorar-loja-modal__text explorar-loja-modal__text--muted">
                Sem descrição disponível para este estabelecimento.
              </p>
            </section>

            <section class="explorar-loja-modal__section">
              <h3 class="explorar-loja-modal__section-title">
                Profissionais
                <span v-if="profissionais.length" class="explorar-loja-modal__count">
                  {{ profissionais.length }}
                </span>
              </h3>
              <p
                v-if="loadingCatalogo && profissionais.length === 0"
                class="explorar-loja-modal__text explorar-loja-modal__text--muted"
              >
                Carregando profissionais…
              </p>
              <ul v-else-if="profissionais.length" class="explorar-loja-modal__profs">
                <li
                  v-for="prof in profissionais"
                  :key="prof.publicGuid"
                  class="explorar-loja-modal__prof"
                >
                  <img
                    v-if="prof.foto"
                    :src="prof.foto"
                    :alt="`Foto de ${prof.nomePublico}`"
                    class="explorar-loja-modal__prof-foto"
                    loading="lazy"
                    decoding="async"
                  />
                  <span v-else class="explorar-loja-modal__prof-fallback" aria-hidden="true">
                    {{ prof.nomePublico.charAt(0) }}
                  </span>
                  <span class="explorar-loja-modal__prof-nome">{{ prof.nomePublico }}</span>
                </li>
              </ul>
              <p v-else class="explorar-loja-modal__text explorar-loja-modal__text--muted">
                Nenhum profissional disponível no momento.
              </p>
            </section>

            <section class="explorar-loja-modal__section">
              <h3 class="explorar-loja-modal__section-title">
                Serviços
                <span v-if="servicos.length" class="explorar-loja-modal__count">
                  {{ servicos.length }}
                </span>
              </h3>
              <p
                v-if="loadingCatalogo && servicos.length === 0"
                class="explorar-loja-modal__text explorar-loja-modal__text--muted"
              >
                Carregando serviços…
              </p>
              <ul v-else-if="servicos.length" class="explorar-loja-modal__servicos">
                <li
                  v-for="servico in servicos"
                  :key="servico.id"
                  class="explorar-loja-modal__servico"
                >
                  <div class="explorar-loja-modal__servico-main">
                    <p class="explorar-loja-modal__servico-nome">{{ servico.nome }}</p>
                    <p
                      v-if="servico.descricao?.trim()"
                      class="explorar-loja-modal__servico-desc"
                    >
                      {{ servico.descricao }}
                    </p>
                    <p class="explorar-loja-modal__servico-meta">
                      {{ servico.duracaoMinutosEstimada }} min
                    </p>
                  </div>
                  <p class="explorar-loja-modal__servico-preco">
                    {{ formatPrecoRange(servico.precoMinimo, servico.precoMaximo) }}
                  </p>
                </li>
              </ul>
              <p v-else class="explorar-loja-modal__text explorar-loja-modal__text--muted">
                Nenhum serviço disponível no momento.
              </p>
            </section>
          </div>
        </div>

        <div class="explorar-loja-modal__footer">
          <button
            type="button"
            class="explorar-loja-modal__btn explorar-loja-modal__btn--ghost"
            @click="emit('close')"
          >
            Fechar
          </button>
          <RouterLink
            :to="lojaAgendarPath(item.publicGuid)"
            class="explorar-loja-modal__btn explorar-loja-modal__btn--primary"
          >
            Agendar
          </RouterLink>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.explorar-loja-modal {
  position: fixed;
  inset: 0;
  z-index: 110;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0.75rem;
}

@media (min-width: 640px) {
  .explorar-loja-modal {
    align-items: center;
    padding: 1.25rem;
  }
}

.explorar-loja-modal__backdrop {
  position: absolute;
  inset: 0;
  border: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  background: rgb(8 5 20 / 0.72);
  backdrop-filter: blur(3px);
}

.explorar-loja-modal__panel {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: 30rem;
  max-height: min(92vh, 44rem);
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: 1.25rem 1.25rem 0.85rem 0.85rem;
  background: linear-gradient(165deg, #1a1238 0%, #0d0825 55%, #120a2e 100%);
  box-shadow:
    0 28px 60px -28px rgb(0 0 0 / 0.75),
    0 0 0 1px rgb(201 162 39 / 0.08);
  animation: explorar-loja-modal-in 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (min-width: 640px) {
  .explorar-loja-modal__panel {
    border-radius: 1.25rem;
  }
}

@keyframes explorar-loja-modal-in {
  from {
    opacity: 0;
    transform: translateY(1.25rem) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.explorar-loja-modal__close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 2;
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: 0.65rem;
  background: rgb(255 255 255 / 0.06);
  color: rgb(255 255 255 / 0.7);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.explorar-loja-modal__close:hover {
  background: rgb(255 255 255 / 0.12);
  color: #fff;
}

.explorar-loja-modal__scroll {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.explorar-loja-modal__header {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 1.25rem 3.25rem 0.15rem 1.25rem;
}

.explorar-loja-modal__logo-wrap {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 5.25rem;
  height: 5.25rem;
  overflow: hidden;
  border: 1px solid rgb(201 162 39 / 0.35);
  border-radius: 1rem;
  background: #0a0718;
  box-shadow: 0 10px 22px -14px rgb(0 0 0 / 0.7);
}

.explorar-loja-modal__logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  padding: 0.35rem;
}

.explorar-loja-modal__fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--glow-gold, #c9a227);
  background: color-mix(in srgb, var(--glow-gold, #c9a227) 14%, #160e33);
}

.explorar-loja-modal__heading {
  min-width: 0;
  flex: 1;
  padding-top: 0.15rem;
}

.explorar-loja-modal__badge {
  display: inline-flex;
  margin-bottom: 0.35rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--glow-gold, #c9a227) 92%, #1a1020);
  color: #0d0825;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.22rem 0.55rem;
}

.explorar-loja-modal__content {
  padding: 0.35rem 1.25rem 0.5rem;
}

.explorar-loja-modal__categoria {
  margin: 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--glow-gold, #c9a227);
}

.explorar-loja-modal__title {
  margin: 0.2rem 0 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
}

.explorar-loja-modal__chips {
  margin-top: 0.65rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.explorar-loja-modal__section:first-child {
  margin-top: 0.85rem;
}

.explorar-loja-modal__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.05);
  padding: 0.3rem 0.7rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.9);
}

.explorar-loja-modal__chip--muted {
  color: rgb(255 255 255 / 0.55);
}

.explorar-loja-modal__section {
  margin-top: 1.05rem;
  padding-top: 0.95rem;
  border-top: 1px solid rgb(255 255 255 / 0.08);
}

.explorar-loja-modal__section-title {
  margin: 0 0 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.4);
}

.explorar-loja-modal__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.15rem;
  border-radius: 9999px;
  background: rgb(201 162 39 / 0.18);
  padding: 0 0.35rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--glow-gold, #c9a227);
}

.explorar-loja-modal__profs {
  display: flex;
  gap: 0.65rem;
  margin: 0.55rem 0 0;
  padding: 0.1rem 0.15rem 0.35rem;
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
}

.explorar-loja-modal__prof {
  display: flex;
  width: 4.6rem;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.explorar-loja-modal__prof-foto,
.explorar-loja-modal__prof-fallback {
  width: 3.15rem;
  height: 3.15rem;
  border-radius: 9999px;
  border: 1.5px solid rgb(201 162 39 / 0.4);
  object-fit: cover;
}

.explorar-loja-modal__prof-fallback {
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--glow-gold, #c9a227) 16%, #160e33);
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--glow-gold, #c9a227);
}

.explorar-loja-modal__prof-nome {
  width: 100%;
  overflow: hidden;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  color: rgb(255 255 255 / 0.82);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.explorar-loja-modal__servicos {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin: 0.55rem 0 0;
  padding: 0;
  list-style: none;
}

.explorar-loja-modal__servico {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: 0.75rem;
  background: rgb(255 255 255 / 0.03);
  padding: 0.7rem 0.8rem;
}

.explorar-loja-modal__servico-main {
  min-width: 0;
  flex: 1;
}

.explorar-loja-modal__servico-nome {
  margin: 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.25;
  color: #fff;
}

.explorar-loja-modal__servico-desc {
  margin: 0.25rem 0 0;
  display: -webkit-box;
  overflow: hidden;
  font-family: Poppins, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 300;
  line-height: 1.4;
  color: rgb(255 255 255 / 0.5);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.explorar-loja-modal__servico-meta {
  margin: 0.35rem 0 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.45);
}

.explorar-loja-modal__servico-preco {
  margin: 0;
  flex: 0 0 auto;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--glow-gold, #c9a227);
  white-space: nowrap;
}

.explorar-loja-modal__text {
  margin: 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  line-height: 1.4;
  color: rgb(255 255 255 / 0.78);
}

.explorar-loja-modal__text--muted {
  color: rgb(255 255 255 / 0.4);
}

.explorar-loja-modal__horario {
  margin: 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.7);
}

.explorar-loja-modal__horario--aberto {
  color: rgb(110 231 183 / 0.95);
}

.explorar-loja-modal__desc {
  margin: 0;
  font-family: Poppins, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  font-weight: 300;
  line-height: 1.55;
  color: rgb(255 255 255 / 0.68);
  white-space: pre-line;
}

.explorar-loja-modal__footer {
  display: flex;
  gap: 0.55rem;
  flex-shrink: 0;
  border-top: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(8 5 20 / 0.55);
  padding: 0.85rem 1.15rem calc(0.85rem + env(safe-area-inset-bottom, 0px));
}

.explorar-loja-modal__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  border-radius: 0.8rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
}

.explorar-loja-modal__btn:hover {
  transform: translateY(-1px);
}

.explorar-loja-modal__btn--ghost {
  flex: 0 0 auto;
  min-width: 5.5rem;
  border: 1px solid rgb(255 255 255 / 0.16);
  background: transparent;
  color: #fff;
  padding: 0 1rem;
}

.explorar-loja-modal__btn--primary {
  flex: 1;
  border: none;
  background: var(--glow-gold-cta, var(--glow-gold, #c9a227));
  color: #0d0825;
  padding: 0 1.1rem;
}

@media (prefers-reduced-motion: reduce) {
  .explorar-loja-modal__panel {
    animation: none;
  }
}
</style>
