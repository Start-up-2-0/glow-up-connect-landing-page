<script setup lang="ts">
import { computed } from 'vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import type { AvaliacoesPaginadas } from '@/types/avaliacao.types'

const props = defineProps<{
  avaliacoes: AvaliacoesPaginadas | null
  notaMediaFallback?: number | null
  totalFallback?: number | null
}>()

const { isVisible } = useRevealOnScroll()

const resumo = computed(() => props.avaliacoes?.resumo ?? null)
const nota = computed(
  () => resumo.value?.notaMedia ?? props.notaMediaFallback ?? 0,
)
const total = computed(
  () => resumo.value?.totalAvaliacoes ?? props.totalFallback ?? 0,
)

const distribuicao = computed(() => {
  const base = [5, 4, 3, 2, 1].map((n) => ({
    nota: n,
    quantidade: 0,
  }))
  const items = resumo.value?.distribuicao ?? []
  for (const item of items) {
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
  <section
    ref="revealRoot"
    class="loja-section loja-reveal"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="loja-avaliacoes-title"
  >
    <div class="loja-section__inner">
      <p class="loja-section__eyebrow">Avaliações</p>
      <h2 id="loja-avaliacoes-title" class="loja-section__title">
        O que os clientes dizem
      </h2>

      <div class="loja-avaliacoes__summary">
        <div class="loja-avaliacoes__score">
          <p class="loja-avaliacoes__nota">
            {{ total > 0 ? nota.toFixed(1).replace('.', ',') : '—' }}
          </p>
          <p class="loja-avaliacoes__total">
            {{ total > 0 ? `${total} avaliação${total === 1 ? '' : 'ões'}` : 'Sem avaliações ainda' }}
          </p>
        </div>

        <ul v-if="total > 0" class="loja-avaliacoes__bars" aria-label="Distribuição das notas">
          <li v-for="item in distribuicao" :key="item.nota">
            <span class="loja-avaliacoes__bar-label">{{ item.nota }}</span>
            <span class="loja-avaliacoes__bar-track">
              <span
                class="loja-avaliacoes__bar-fill"
                :style="{ width: `${item.pct}%` }"
              />
            </span>
            <span class="loja-avaliacoes__bar-qty">{{ item.quantidade }}</span>
          </li>
        </ul>
      </div>

      <ul v-if="comentarios.length > 0" class="loja-avaliacoes__list">
        <li
          v-for="(item, index) in comentarios"
          :key="`${item.avaliadoEm}-${index}`"
          class="loja-avaliacao"
          :style="{ '--delay': `${Math.min(index, 6) * 40}ms` }"
        >
          <div class="loja-avaliacao__head">
            <strong>{{ item.clienteNome }}</strong>
            <span>★ {{ item.nota }}</span>
          </div>
          <p v-if="item.comentario?.trim()" class="loja-avaliacao__texto">
            {{ item.comentario }}
          </p>
          <time class="loja-avaliacao__data" :datetime="item.avaliadoEm">
            {{ formatData(item.avaliadoEm) }}
          </time>
        </li>
      </ul>

      <p v-else-if="total === 0" class="loja-empty">
        Seja um dos primeiros a avaliar após o atendimento.
      </p>
    </div>
  </section>
</template>

<style scoped>
.loja-avaliacoes__summary {
  margin-top: 1.5rem;
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .loja-avaliacoes__summary {
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 2rem;
  }
}

.loja-avaliacoes__score {
  border: 1px solid rgb(201 162 39 / 0.3);
  border-radius: 1.25rem;
  background: rgb(201 162 39 / 0.08);
  padding: 1.25rem 1.5rem;
  text-align: center;
  min-width: 8.5rem;
}

.loja-avaliacoes__nota {
  margin: 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--glow-gold, #c9a227);
}

.loja-avaliacoes__total {
  margin: 0.45rem 0 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.82rem;
  color: rgb(255 255 255 / 0.55);
}

.loja-avaliacoes__bars {
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.4rem;
  list-style: none;
}

.loja-avaliacoes__bars li {
  display: grid;
  grid-template-columns: 1.25rem 1fr 1.75rem;
  gap: 0.55rem;
  align-items: center;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.8rem;
  color: rgb(255 255 255 / 0.55);
}

.loja-avaliacoes__bar-track {
  display: block;
  height: 0.45rem;
  overflow: hidden;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.08);
}

.loja-avaliacoes__bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #c9a227, #e8c65a);
}

.loja-avaliacoes__bar-qty {
  text-align: right;
}

.loja-avaliacoes__list {
  margin: 1.75rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
  list-style: none;
}

@media (min-width: 768px) {
  .loja-avaliacoes__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.loja-avaliacao {
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: 1.15rem;
  background: rgb(255 255 255 / 0.04);
  padding: 1rem 1.1rem;
}

.loja-reveal.is-visible .loja-avaliacao {
  animation: loja-card-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--delay, 0ms);
}

.loja-avaliacao__head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  color: #fff;
}

.loja-avaliacao__head span {
  color: var(--glow-gold, #c9a227);
  font-weight: 700;
}

.loja-avaliacao__texto {
  margin: 0.55rem 0 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgb(255 255 255 / 0.65);
}

.loja-avaliacao__data {
  display: block;
  margin-top: 0.65rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
  color: rgb(255 255 255 / 0.35);
}

@keyframes loja-card-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .loja-reveal.is-visible .loja-avaliacao {
    animation: none;
  }
}
</style>
