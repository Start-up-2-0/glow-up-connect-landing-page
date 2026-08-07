<script setup lang="ts">
import { computed } from 'vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import type { AvaliacoesPaginadas } from '@/types/avaliacao.types'

const props = defineProps<{
  avaliacoes: AvaliacoesPaginadas | null
  notaMediaFallback?: number | null
  totalFallback?: number | null
}>()

const { isVisible: scoreVisible } = useRevealOnScroll('scoreRoot')
const { isVisible: quotesVisible } = useRevealOnScroll('quotesRoot')

const resumo = computed(() => props.avaliacoes?.resumo ?? null)
const nota = computed(() => resumo.value?.notaMedia ?? props.notaMediaFallback ?? 0)
const total = computed(() => resumo.value?.totalAvaliacoes ?? props.totalFallback ?? 0)

const distribuicao = computed(() => {
  const base = [5, 4, 3, 2, 1].map((n) => ({ nota: n, quantidade: 0 }))
  for (const item of resumo.value?.distribuicao ?? []) {
    const slot = base.find((b) => b.nota === item.nota)
    if (slot) slot.quantidade = item.quantidade
  }
  const max = Math.max(1, ...base.map((b) => b.quantidade))
  return base.map((b) => ({
    ...b,
    pct: Math.round((b.quantidade / max) * 100),
  }))
})

const comentarios = computed(() => props.avaliacoes?.itens ?? [])
const destaque = computed(() => {
  if (comentarios.value.length === 0) return null
  return [...comentarios.value].sort((a, b) => {
    if (b.nota !== a.nota) return b.nota - a.nota
    return (b.comentario?.length ?? 0) - (a.comentario?.length ?? 0)
  })[0]
})

const demaisComentarios = computed(() => {
  if (!destaque.value) return comentarios.value
  return comentarios.value.filter((c) => c !== destaque.value)
})

function formatData(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
</script>

<template>
  <LandingStorySection
    chapter-index="05"
    chapter-label="Reputação"
    :show-progress="false"
  >
    <div class="px-4 pb-16 pt-4 lg:px-8 lg:pb-24 lg:pt-6">
      <div class="mx-auto max-w-[1280px]">
        <LandingSectionHeader
          eyebrow="Avaliações"
          title="O que os clientes"
          highlight="dizem"
          subtitle="Notas reais de quem já foi atendido — transparência para você decidir com confiança."
        />

        <div
          ref="scoreRoot"
          class="landing-stagger mt-14 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
          :class="scoreVisible && 'is-visible'"
        >
          <article
            class="flex flex-col items-center justify-center rounded-[2rem] border border-glow-gold/25 bg-glow-gold/10 px-6 py-10 text-center landing-glass-card sm:py-12"
          >
            <p class="landing-stat-pop font-montserrat text-6xl font-black text-glow-gold sm:text-7xl">
              {{ total > 0 ? nota.toFixed(1).replace('.', ',') : '—' }}
            </p>
            <div class="mt-3 flex gap-0.5 text-glow-gold" aria-hidden="true">
              <svg
                v-for="n in 5"
                :key="n"
                class="size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2.9 6.9H22l-5.5 4.5 2.1 6.6L12 16.9 5.4 20l2.1-6.6L2 8.9h7.1L12 2z" />
              </svg>
            </div>
            <p class="mt-4 font-satoshi text-sm font-semibold text-white">
              {{ total > 0 ? `${total} avaliação${total === 1 ? '' : 'ões'}` : 'Sem avaliações ainda' }}
            </p>
            <p class="mt-1 font-poppins text-xs font-light text-white/45">
              Média pública do estabelecimento
            </p>
          </article>

          <article
            class="rounded-[2rem] border border-white/15 bg-white/[0.06] p-6 landing-glass-card sm:p-8"
          >
            <p class="font-satoshi text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Distribuição
            </p>
            <ul v-if="total > 0" class="mt-6 space-y-3" aria-label="Distribuição das notas">
              <li
                v-for="item in distribuicao"
                :key="item.nota"
                class="grid grid-cols-[2rem_1fr_2.5rem] items-center gap-3"
              >
                <span class="font-satoshi text-sm font-semibold text-white/70">{{ item.nota }}★</span>
                <span class="h-2 overflow-hidden rounded-full bg-white/10">
                  <span
                    class="block h-full rounded-full bg-gradient-to-r from-glow-gold to-[#e8c65a] transition-[width] duration-700"
                    :style="{ width: `${item.pct}%` }"
                  />
                </span>
                <span class="text-right font-satoshi text-xs text-white/45">{{ item.quantidade }}</span>
              </li>
            </ul>
            <p v-else class="mt-6 font-poppins text-sm font-light text-white/45">
              Assim que os primeiros atendimentos forem avaliados, a distribuição aparece aqui.
            </p>
          </article>
        </div>

        <blockquote
          v-if="destaque"
          class="mt-8 rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/[0.09] to-white/[0.03] p-6 landing-glass-card sm:p-8"
        >
          <p class="font-satoshi text-[11px] font-semibold uppercase tracking-[0.18em] text-glow-gold">
            Destaque
          </p>
          <div class="mt-3 flex gap-0.5 text-glow-gold" :aria-label="`${destaque.nota} estrelas`">
            <svg
              v-for="n in destaque.nota"
              :key="n"
              class="size-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2l2.9 6.9H22l-5.5 4.5 2.1 6.6L12 16.9 5.4 20l2.1-6.6L2 8.9h7.1L12 2z" />
            </svg>
          </div>
          <p class="mt-4 font-poppins text-base font-light leading-relaxed text-white/75 sm:text-lg">
            “{{ destaque.comentario?.trim() || 'Atendimento avaliado positivamente.' }}”
          </p>
          <footer class="mt-6 border-t border-white/10 pt-4">
            <p class="font-montserrat text-sm font-semibold text-white">{{ destaque.clienteNome }}</p>
            <time class="font-satoshi text-xs text-white/45" :datetime="destaque.avaliadoEm">
              {{ formatData(destaque.avaliadoEm) }}
            </time>
          </footer>
        </blockquote>

        <div
          v-if="demaisComentarios.length > 0"
          ref="quotesRoot"
          class="landing-stagger mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          :class="quotesVisible && 'is-visible'"
        >
          <blockquote
            v-for="(item, index) in demaisComentarios"
            :key="`${item.avaliadoEm}-${index}`"
            class="flex flex-col rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-5 landing-glass-card transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08] sm:p-6"
          >
            <div class="flex gap-0.5 text-glow-gold" :aria-label="`${item.nota} estrelas`">
              <svg
                v-for="n in item.nota"
                :key="n"
                class="size-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l2.9 6.9H22l-5.5 4.5 2.1 6.6L12 16.9 5.4 20l2.1-6.6L2 8.9h7.1L12 2z" />
              </svg>
            </div>
            <p class="mt-4 flex-1 font-poppins text-sm font-light leading-relaxed text-white/65">
              “{{ item.comentario?.trim() || 'Cliente avaliou o atendimento.' }}”
            </p>
            <footer class="mt-5 border-t border-white/10 pt-4">
              <p class="font-montserrat text-sm font-semibold text-white">{{ item.clienteNome }}</p>
              <time class="font-satoshi text-xs text-white/40" :datetime="item.avaliadoEm">
                {{ formatData(item.avaliadoEm) }}
              </time>
            </footer>
          </blockquote>
        </div>

        <p
          v-else-if="total === 0"
          class="mx-auto mt-10 max-w-md text-center font-poppins text-sm font-light text-white/45"
        >
          Seja um dos primeiros a avaliar após o atendimento.
        </p>
      </div>
    </div>
  </LandingStorySection>
</template>
