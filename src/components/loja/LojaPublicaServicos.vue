<script setup lang="ts">
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import { lojaAgendarPath } from '@/constants/routes'
import type { ServicoPublico } from '@/types/agendamento.types'
import { formatPrecoRange } from '@/utils/formatters'

defineProps<{
  servicos: ServicoPublico[]
  publicGuid: string
}>()

const { isVisible } = useRevealOnScroll()
</script>

<template>
  <section
    ref="revealRoot"
    class="loja-section loja-reveal"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="loja-servicos-title"
  >
    <div class="loja-section__inner">
      <div class="loja-section__head">
        <div>
          <p class="loja-section__eyebrow">Serviços</p>
          <h2 id="loja-servicos-title" class="loja-section__title">
            O que você pode agendar
          </h2>
        </div>
        <span class="loja-section__count" aria-hidden="true">{{ servicos.length }}</span>
      </div>

      <p v-if="servicos.length === 0" class="loja-empty">
        Nenhum serviço público disponível no momento.
      </p>

      <ul v-else class="loja-servicos__grid">
        <li
          v-for="(servico, index) in servicos"
          :key="servico.id"
          class="loja-servico"
          :style="{ '--delay': `${Math.min(index, 8) * 45}ms` }"
        >
          <div class="loja-servico__body">
            <h3 class="loja-servico__nome">{{ servico.nome }}</h3>
            <p v-if="servico.descricao?.trim()" class="loja-servico__desc">
              {{ servico.descricao }}
            </p>
            <div class="loja-servico__meta">
              <span>{{ servico.duracaoMinutosEstimada }} min</span>
              <span class="loja-servico__preco">
                {{ formatPrecoRange(servico.precoMinimo, servico.precoMaximo) }}
              </span>
            </div>
          </div>
          <LandingCtaButton
            label="Agendar"
            variant="outline"
            size="sm"
            :to="lojaAgendarPath(publicGuid)"
          />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.loja-servicos__grid {
  margin: 1.75rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
  list-style: none;
}

@media (min-width: 768px) {
  .loja-servicos__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}

.loja-servico {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: 1.25rem;
  background: rgb(255 255 255 / 0.04);
  padding: 1.15rem 1.2rem;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
}

.loja-reveal.is-visible .loja-servico {
  animation: loja-card-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--delay, 0ms);
}

.loja-servico:hover {
  transform: translateY(-2px);
  border-color: rgb(201 162 39 / 0.35);
  background: rgb(255 255 255 / 0.06);
}

.loja-servico__nome {
  margin: 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.loja-servico__desc {
  margin: 0.45rem 0 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgb(255 255 255 / 0.55);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.loja-servico__meta {
  margin-top: 0.85rem;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.85rem;
  color: rgb(255 255 255 / 0.5);
}

.loja-servico__preco {
  font-weight: 700;
  color: var(--glow-gold, #c9a227);
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
  .loja-reveal.is-visible .loja-servico {
    animation: none;
  }
}
</style>
