<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import LandingPlanoLimites from '@/components/landing/LandingPlanoLimites.vue'
import { appOnboardingUrl } from '@/constants/urls'
import { aplicarDescontoPercentual, formatBRL } from '@/utils/formatters'
import { getPlanoFeatures } from '@/utils/planoDisplay'
import type { Plano, TipoAssinatura } from '@/types/plano.types'

const props = withDefaults(
  defineProps<{
    open: boolean
    plano: Plano | null
    popular?: boolean
    percentualDesconto?: number | null
    tipoAssinatura?: TipoAssinatura
  }>(),
  {
    popular: false,
    percentualDesconto: null,
    tipoAssinatura: 'Estabelecimento',
  },
)

const emit = defineEmits<{
  close: []
}>()

const features = computed(() => (props.plano ? getPlanoFeatures(props.plano) : []))

const checkoutHref = computed(() =>
  props.plano ? appOnboardingUrl(props.plano.id, props.tipoAssinatura) : undefined,
)

const temDesconto = computed(() => (props.percentualDesconto ?? 0) > 0 && props.plano !== null)

const precoComDesconto = computed(() => {
  if (!props.plano || !temDesconto.value) return 0
  return aplicarDescontoPercentual(props.plano.preco, props.percentualDesconto!)
})

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === 'undefined') return

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeydown)
      return
    }

    document.body.style.overflow = ''
    window.removeEventListener('keydown', handleKeydown)
  },
  { immediate: true },
)

onUnmounted(() => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open && plano"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`plano-detalhes-${plano.id}`"
      >
        <div
          class="absolute inset-0 bg-glow-inverse-surface/70 backdrop-blur-[2px]"
          @click="emit('close')"
        />

        <div
          class="relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-[20px] border border-glow-border-soft bg-glow-surface shadow-2xl"
        >
          <div class="border-b border-glow-border-soft px-6 py-5 sm:px-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p
                  v-if="popular"
                  class="mb-2 flex items-center gap-2 font-montserrat text-xs font-medium text-glow-gold"
                >
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l2.9 6.9H22l-5.5 4.5 2.1 6.6L12 16.9 5.4 20l2.1-6.6L2 8.9h7.1L12 2z" />
                  </svg>
                  POPULAR
                </p>
                <p
                  v-else-if="plano.prioridadeListagemPublica"
                  class="mb-2 font-montserrat text-[10px] font-medium uppercase tracking-wide text-glow-gold/80"
                >
                  Destaque no marketplace
                </p>
                <h2
                  :id="`plano-detalhes-${plano.id}`"
                  class="font-montserrat text-2xl font-semibold leading-tight text-glow-text"
                >
                  {{ plano.nome }}
                </h2>
                <p class="mt-2 font-poppins text-sm font-light leading-snug text-glow-text-subtle">
                  {{ plano.descricao }}
                </p>
              </div>
              <button
                type="button"
                class="shrink-0 rounded-lg p-2 text-glow-text-muted transition hover:bg-glow-hover-surface hover:text-glow-text"
                aria-label="Fechar"
                @click="emit('close')"
              >
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <div class="mt-4">
              <template v-if="temDesconto">
                <p class="font-montserrat text-sm font-medium text-glow-gold/55 line-through">
                  {{ formatBRL(plano.preco) }}/mês
                </p>
                <p>
                  <span class="font-montserrat text-2xl font-black text-glow-gold">
                    {{ formatBRL(precoComDesconto) }}
                  </span>
                  <span class="ml-1 font-montserrat text-xs font-bold text-glow-gold">/mês</span>
                </p>
                <p class="mt-1 font-montserrat text-xs font-semibold text-glow-gold">
                  {{ percentualDesconto }}% off para sempre
                </p>
              </template>
              <p v-else>
                <span class="font-montserrat text-2xl font-black text-glow-gold">
                  {{ formatBRL(plano.preco) }}
                </span>
                <span class="ml-1 font-montserrat text-xs font-bold text-glow-gold">/mês</span>
              </p>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            <LandingPlanoLimites class="mb-6" :plano="plano" variant="card" />

            <h3 class="mb-3 font-montserrat text-sm font-semibold text-glow-text">
              Benefícios incluídos
            </h3>
            <ul class="space-y-1">
              <li
                v-for="feature in features"
                :key="feature"
                class="flex items-start gap-2.5 py-1.5"
              >
                <svg
                  class="mt-0.5 size-5 shrink-0 text-glow-gold"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                <span class="font-poppins text-sm font-light leading-snug text-glow-text-subtle">
                  {{ feature }}
                </span>
              </li>
            </ul>
          </div>

          <div class="border-t border-glow-border-soft px-6 py-5 sm:px-8">
            <LandingCtaButton
              v-if="checkoutHref"
              class="w-full !max-w-none justify-center sm:!w-full"
              :href="checkoutHref"
              label="Assinar agora"
              variant="gold"
              @click="emit('close')"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
