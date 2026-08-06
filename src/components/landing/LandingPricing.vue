<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import LoadingSpinner from '@/components/feedback/LoadingSpinner.vue'
import EmptyState from '@/components/feedback/EmptyState.vue'
import PromocaoLancamentoBanner from '@/components/assinatura/PromocaoLancamentoBanner.vue'
import LandingPlanoCard from '@/components/landing/LandingPlanoCard.vue'
import LandingPlanoDetalhesModal from '@/components/landing/LandingPlanoDetalhesModal.vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import { LANDING_SECTIONS } from '@/constants/landing'
import { STORY_CHAPTERS } from '@/constants/showcaseCallouts'
import { usePlanosStore } from '@/stores/planos.store'
import { useApiError } from '@/composables/useApiError'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import type { Plano } from '@/types/plano.types'

const { isVisible } = useRevealOnScroll()
const { isVisible: promoVisible } = useRevealOnScroll('promoRoot')
const chapter = STORY_CHAPTERS.oferta

const planosStore = usePlanosStore()
const { planos, promocao, loading } = storeToRefs(planosStore)
const { resolveError } = useApiError()
const erro = ref<string | null>(null)
const planoDetalhesAberto = ref<Plano | null>(null)

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

function isPopular(plano: Plano): boolean {
  return plano.id === planoEssencial.value?.id
}

function abrirDetalhesPlano(plano: Plano) {
  planoDetalhesAberto.value = plano
}

function fecharDetalhesPlano() {
  planoDetalhesAberto.value = null
}

onMounted(async () => {
  try {
    await planosStore.fetchPlanos()
  } catch (err) {
    erro.value = resolveError(err)
  }
})
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
          title="Escolha o plano"
          highlight="da sua operação"
          subtitle="Do começo ao crescimento — sem surpresas e sem taxas escondidas."
        />

        <div
          v-if="promocao?.disponivel"
          ref="promoRoot"
          class="landing-reveal mx-auto mt-10 max-w-3xl"
          :class="promoVisible && 'is-visible'"
        >
          <PromocaoLancamentoBanner variant="landing" :promocao="promocao" />
        </div>

        <LoadingSpinner v-if="loading" class="mt-16 !text-white" />
        <p v-else-if="erro" class="mt-16 text-center text-sm text-red-300">{{ erro }}</p>
        <EmptyState
          v-else-if="planos.length === 0"
          class="mt-16 text-white [&_h3]:text-white [&_p]:text-white/60"
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
            :key="plano.id"
            :plano="plano"
            :popular="isPopular(plano)"
            :percentual-desconto="percentualDescontoPromocao"
            @ver-detalhes="abrirDetalhesPlano"
          />
        </div>

        <LandingPlanoDetalhesModal
          :open="planoDetalhesAberto !== null"
          :plano="planoDetalhesAberto"
          :popular="planoDetalhesAberto ? isPopular(planoDetalhesAberto) : false"
          :percentual-desconto="percentualDescontoPromocao"
          @close="fecharDetalhesPlano"
        />
      </div>
    </div>
  </LandingStorySection>
</template>
