<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import type { EstabelecimentoProximo, EstabelecimentoPublico } from '@/types/estabelecimento.types'
import { lojaAgendarPath } from '@/constants/routes'
import { publicoService } from '@/services/publicoService'
import { formatDistanciaKm } from '@/utils/formatters'
import { formatEnderecoMapa } from '@/utils/explorarMapa'

const props = defineProps<{
  item: EstabelecimentoProximo
}>()

const emit = defineEmits<{
  close: []
}>()

const detalhe = ref<EstabelecimentoPublico | null>(null)
const loadingDetalhe = ref(false)
const showDescricao = ref(false)

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

const notaLabel = computed(() => {
  const nota = props.item.notaMedia
  if (nota == null || nota <= 0) return 'Sem avaliações'
  return nota.toFixed(1).replace('.', ',')
})

async function carregarDetalhe(guid: string) {
  loadingDetalhe.value = true
  try {
    detalhe.value = await publicoService.obterEstabelecimento(guid)
  } catch {
    detalhe.value = null
  } finally {
    loadingDetalhe.value = false
  }
}

onMounted(() => {
  void carregarDetalhe(props.item.publicGuid)
})

watch(
  () => props.item.publicGuid,
  (guid) => {
    void carregarDetalhe(guid)
  },
)
</script>

<template>
  <article class="explorar-lojas-card" role="dialog" :aria-label="item.nome">
    <button
      type="button"
      class="explorar-lojas-card__close"
      aria-label="Fechar"
      @click="emit('close')"
    >
      <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>

    <div class="explorar-lojas-card__media">
      <img
        v-if="item.logo"
        :src="item.logo"
        :alt="item.nome"
        class="size-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <span v-else class="explorar-lojas-card__fallback">
        {{ item.nome.charAt(0) }}
      </span>
      <span v-if="item.destaqueMarketplace" class="explorar-lojas-card__badge">Destaque</span>
    </div>

    <div class="explorar-lojas-card__body">
      <h3 class="explorar-lojas-card__title">{{ item.nome }}</h3>

      <span v-if="item.categoria" class="explorar-lojas-card__categoria">
        {{ item.categoria }}
      </span>

      <div class="explorar-lojas-card__meta">
        <span class="explorar-lojas-card__rating" aria-label="Avaliação">
          <svg class="size-3.5 text-glow-gold" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path
              d="M8 1.4 9.7 5.2l4.1.4-3.1 2.8.9 4-3.6-2.1L4.4 12.4l.9-4L2.2 5.6l4.1-.4L8 1.4Z"
            />
          </svg>
          {{ notaLabel }}
          <span v-if="(item.totalAvaliacoes ?? 0) > 0" class="text-white/40">
            ({{ item.totalAvaliacoes }})
          </span>
        </span>
        <span class="explorar-lojas-card__dist">{{ formatDistanciaKm(item.distanciaKm) }}</span>
      </div>

      <p class="explorar-lojas-card__endereco">{{ formatEnderecoMapa(item) }}</p>

      <p v-if="horarioLabel" class="explorar-lojas-card__horario">
        {{ horarioLabel }}
      </p>
      <p v-else-if="loadingDetalhe" class="explorar-lojas-card__horario text-white/30">
        Carregando horário…
      </p>

      <div class="explorar-lojas-card__actions">
        <button
          type="button"
          class="explorar-lojas-card__btn explorar-lojas-card__btn--ghost"
          @click="showDescricao = !showDescricao"
        >
          {{ showDescricao ? 'Ocultar' : 'Ver detalhes' }}
        </button>
        <RouterLink
          :to="lojaAgendarPath(item.publicGuid)"
          class="explorar-lojas-card__btn explorar-lojas-card__btn--primary"
        >
          Agendar
        </RouterLink>
      </div>

      <p v-if="showDescricao && detalhe?.descricao" class="explorar-lojas-card__desc">
        {{ detalhe.descricao }}
      </p>
      <p
        v-else-if="showDescricao && !loadingDetalhe"
        class="explorar-lojas-card__desc"
      >
        Sem descrição disponível para este estabelecimento.
      </p>
    </div>
  </article>
</template>

<style scoped>
.explorar-lojas-card {
  display: grid;
  grid-template-columns: 5.75rem 1fr;
  gap: 0.85rem;
  position: relative;
  border-radius: 1.15rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  background: linear-gradient(155deg, rgb(26 18 56 / 0.96), rgb(13 8 37 / 0.94));
  box-shadow:
    0 22px 50px -24px rgb(0 0 0 / 0.65),
    0 0 0 1px rgb(201 162 39 / 0.06);
  padding: 0.75rem;
  backdrop-filter: blur(16px);
  animation: explorar-card-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes explorar-card-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.explorar-lojas-card__close {
  position: absolute;
  top: 0.45rem;
  right: 0.45rem;
  z-index: 2;
  display: inline-flex;
  width: 1.85rem;
  height: 1.85rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.55rem;
  border: none;
  background: rgb(255 255 255 / 0.08);
  color: rgb(255 255 255 / 0.65);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.explorar-lojas-card__close:hover {
  background: rgb(255 255 255 / 0.14);
  color: #fff;
}

.explorar-lojas-card__media {
  position: relative;
  width: 5.75rem;
  height: 5.75rem;
  overflow: hidden;
  border-radius: 0.85rem;
  background: color-mix(in srgb, var(--glow-gold) 18%, transparent);
}

.explorar-lojas-card__fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--glow-gold);
}

.explorar-lojas-card__badge {
  position: absolute;
  left: 0.35rem;
  bottom: 0.35rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--glow-gold) 92%, #1a1020);
  color: #0d0825;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 0.15rem 0.4rem;
}

.explorar-lojas-card__body {
  min-width: 0;
  padding-right: 1.35rem;
}

.explorar-lojas-card__title {
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.98rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.25;
}

.explorar-lojas-card__categoria {
  margin-top: 0.3rem;
  display: inline-flex;
  border-radius: 9999px;
  padding: 0.15rem 0.55rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--glow-gold);
  background: color-mix(in srgb, var(--glow-gold) 14%, transparent);
}

.explorar-lojas-card__meta {
  margin-top: 0.45rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
}

.explorar-lojas-card__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.85);
}

.explorar-lojas-card__dist {
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.45);
}

.explorar-lojas-card__endereco,
.explorar-lojas-card__horario {
  margin-top: 0.28rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.7rem;
  color: rgb(255 255 255 / 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.explorar-lojas-card__horario {
  color: rgb(110 231 183 / 0.85);
}

.explorar-lojas-card__actions {
  margin-top: 0.7rem;
  display: flex;
  gap: 0.4rem;
}

.explorar-lojas-card__btn {
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 2.05rem;
  border-radius: 0.7rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
}

.explorar-lojas-card__btn:hover {
  transform: translateY(-1px);
}

.explorar-lojas-card__btn--ghost {
  border: 1px solid rgb(255 255 255 / 0.14);
  color: #fff;
  background: rgb(255 255 255 / 0.05);
}

.explorar-lojas-card__btn--primary {
  background: var(--glow-gold-cta, var(--glow-gold));
  color: #0d0825;
}

.explorar-lojas-card__desc {
  margin-top: 0.65rem;
  grid-column: 1 / -1;
  font-family: Poppins, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 300;
  line-height: 1.45;
  color: rgb(255 255 255 / 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 420px) {
  .explorar-lojas-card {
    grid-template-columns: 1fr;
  }

  .explorar-lojas-card__media {
    width: 100%;
    height: 7.5rem;
  }
}
</style>
