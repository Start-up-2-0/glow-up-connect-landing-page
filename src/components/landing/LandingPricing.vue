<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import LoadingSpinner from '@/components/feedback/LoadingSpinner.vue'
import EmptyState from '@/components/feedback/EmptyState.vue'
import PromocaoLancamentoBanner from '@/components/assinatura/PromocaoLancamentoBanner.vue'
import LandingPlanoCard from '@/components/landing/LandingPlanoCard.vue'
import LandingPlanoDetalhesModal from '@/components/landing/LandingPlanoDetalhesModal.vue'
import LandingTipoOperacaoPicker from '@/components/landing/LandingTipoOperacaoPicker.vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import { LANDING_SECTIONS } from '@/constants/landing'
import { STORY_CHAPTERS } from '@/constants/showcaseCallouts'
import { usePlanosStore } from '@/stores/planos.store'
import { useApiError } from '@/composables/useApiError'
import { useLandingPlanosPref } from '@/composables/useLandingPlanosPref'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import { FEATURE_FLAGS } from '@/config/features'
import { TIPO_ASSINATURA_PADRAO } from '@/utils/tipoAssinatura'
import type { Plano, TipoAssinatura } from '@/types/plano.types'

const { isVisible } = useRevealOnScroll()
const { isVisible: promoVisible } = useRevealOnScroll('promoRoot')
const { tipoPreferido } = useLandingPlanosPref()
const chapter = STORY_CHAPTERS.oferta

const planosStore = usePlanosStore()
const { planos, promocao, loading } = storeToRefs(planosStore)
const { resolveError } = useApiError()
const erro = ref<string | null>(null)
const planoDetalhesAberto = ref<Plano | null>(null)
const tipoAssinatura = ref<TipoAssinatura | null>(
  FEATURE_FLAGS.lojasHabilitadas ? null : TIPO_ASSINATURA_PADRAO,
)

const percentualDescontoPromocao = computed(() =>
  promocao.value?.disponivel ? promocao.value.percentualDescontoMensalidade : null,
)

const planoEssencial = computed(() => planos.value.find((p) => p.nome === 'Essencial'))

/** Popular no meio no desktop quando há 3 planos */
const planosOrdenados = computed(() => {
  const list = [...planos.value]
  if (list.length !== 3 || !planoEssencial.value) return list
  const popular = planoEssencial.value
  const others = list.filter((p) => p.id !== popular.id)
  return [others[0], popular, others[1]].filter(Boolean) as Plano[]
})

const copyTitulo = computed(() =>
  tipoAssinatura.value === 'ProfissionalAutonomo'
    ? 'Planos para quem trabalha'
    : 'Escolha o plano',
)

const copyHighlight = computed(() =>
  tipoAssinatura.value === 'ProfissionalAutonomo' ? 'sozinho' : 'do seu negócio',
)

const copySubtitle = computed(() =>
  tipoAssinatura.value === 'ProfissionalAutonomo'
    ? 'Essencial e Premium para barbeiros e cabeleireiros autônomos — sem taxa escondida.'
    : 'Planos para barbearias e salões com equipe — escolha o que cabe na sua operação hoje.',
)

function isPopular(plano: Plano): boolean {
  return plano.id === planoEssencial.value?.id
}

function abrirDetalhesPlano(plano: Plano) {
  planoDetalhesAberto.value = plano
}

function fecharDetalhesPlano() {
  planoDetalhesAberto.value = null
}

async function carregarPlanos(tipo: TipoAssinatura) {
  erro.value = null
  planoDetalhesAberto.value = null
  try {
    await planosStore.fetchPlanos(true, tipo)
  } catch (err) {
    erro.value = resolveError(err)
  }
}

watch(tipoAssinatura, (tipo) => {
  if (tipo) void carregarPlanos(tipo)
}, { immediate: true })

watch(
  tipoPreferido,
  (tipo) => {
    if (!tipo) return
    tipoAssinatura.value = FEATURE_FLAGS.lojasHabilitadas ? tipo : TIPO_ASSINATURA_PADRAO
  },
  { immediate: true },
)
</script>

<template>
  <LandingStorySection
    :id="LANDING_SECTIONS.planos"
    tone="dark"
    :chapter-index="chapter.index"
    :chapter-label="chapter.label"
  >
    <div class="relative overflow-x-clip px-4 pb-20 pt-4 lg:px-8 lg:pb-28 lg:pt-6">
      <div
        class="pointer-events-none absolute left-1/2 top-32 h-72 w-[min(100%,36rem)] -translate-x-1/2 rounded-full bg-glow-gold-cta/15 blur-[110px]"
        aria-hidden="true"
      />

      <div class="relative mx-auto max-w-[1280px]">
        <LandingSectionHeader
          eyebrow="Planos"
          :title="copyTitulo"
          :highlight="copyHighlight"
          :subtitle="copySubtitle"
        />

        <div v-if="FEATURE_FLAGS.lojasHabilitadas" class="mt-10">
          <LandingTipoOperacaoPicker v-model="tipoAssinatura" />
        </div>

        <template v-if="tipoAssinatura">
          <div
            v-if="promocao?.disponivel"
            ref="promoRoot"
            class="landing-reveal mx-auto mt-10 max-w-3xl"
            :class="promoVisible && 'is-visible'"
          >
            <PromocaoLancamentoBanner variant="landing" :promocao="promocao" />
          </div>

          <LoadingSpinner v-if="loading" class="mt-16 !text-glow-text" />
          <p v-else-if="erro" class="mt-16 text-center text-sm text-red-300">{{ erro }}</p>
          <EmptyState
            v-else-if="planos.length === 0"
            class="mt-16 text-glow-text [&_h3]:text-glow-text [&_p]:text-glow-text-muted"
            title="Nenhum plano disponível"
            description="Tente novamente mais tarde."
          />

          <div
            v-else
            ref="revealRoot"
            class="landing-stagger mt-14 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3"
            :class="[promocao?.disponivel ? 'mt-10' : '', isVisible && 'is-visible']"
          >
            <LandingPlanoCard
              v-for="plano in planosOrdenados"
              :key="`${tipoAssinatura}-${plano.id}`"
              :plano="plano"
              :tipo-assinatura="tipoAssinatura"
              :popular="isPopular(plano)"
              :percentual-desconto="percentualDescontoPromocao"
              @ver-detalhes="abrirDetalhesPlano"
            />
          </div>

          <LandingPlanoDetalhesModal
            :open="planoDetalhesAberto !== null"
            :plano="planoDetalhesAberto"
            :tipo-assinatura="tipoAssinatura"
            :popular="planoDetalhesAberto ? isPopular(planoDetalhesAberto) : false"
            :percentual-desconto="percentualDescontoPromocao"
            @close="fecharDetalhesPlano"
          />
        </template>
      </div>
    </div>
  </LandingStorySection>
</template>
