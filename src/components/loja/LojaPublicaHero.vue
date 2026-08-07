<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import type { EstabelecimentoPublico } from '@/types/estabelecimento.types'
import { lojaAgendarPath, ROUTE_PATHS } from '@/constants/routes'
import { formatDistanciaKm } from '@/utils/formatters'

defineProps<{
  loja: EstabelecimentoPublico
  enderecoResumo: string | null
}>()
</script>

<template>
  <header class="loja-hero">
    <div class="loja-hero__glow" aria-hidden="true" />
    <div class="loja-hero__inner">
      <RouterLink
        :to="ROUTE_PATHS.EXPLORAR_LOJAS"
        class="loja-hero__back"
      >
        ← Voltar ao mapa
      </RouterLink>

      <div class="loja-hero__card">
        <div class="loja-hero__media">
          <img
            v-if="loja.logo"
            :src="loja.logo"
            :alt="`Logo de ${loja.nome}`"
            class="loja-hero__logo"
            width="120"
            height="120"
            decoding="async"
          />
          <span v-else class="loja-hero__fallback" aria-hidden="true">
            {{ loja.nome.charAt(0) }}
          </span>
        </div>

        <div class="loja-hero__copy">
          <p v-if="loja.categoria" class="loja-hero__categoria">{{ loja.categoria }}</p>
          <h1 class="loja-hero__title">{{ loja.nome }}</h1>

          <div class="loja-hero__meta">
            <span class="loja-hero__chip" aria-label="Avaliação">
              <svg class="size-3.5 text-glow-gold" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 1.4 9.7 5.2l4.1.4-3.1 2.8.9 4-3.6-2.1L4.4 12.4l.9-4L2.2 5.6l4.1-.4L8 1.4Z" />
              </svg>
              <template v-if="(loja.notaMedia ?? 0) > 0">
                {{ loja.notaMedia!.toFixed(1).replace('.', ',') }}
                <span class="text-white/45">({{ loja.totalAvaliacoes ?? 0 }})</span>
              </template>
              <template v-else>Sem avaliações</template>
            </span>
            <span
              v-if="loja.distanciaKm != null"
              class="loja-hero__chip loja-hero__chip--muted"
            >
              {{ formatDistanciaKm(loja.distanciaKm) }}
            </span>
            <span
              v-if="loja.abertoAgora != null"
              class="loja-hero__chip"
              :class="loja.abertoAgora ? 'loja-hero__chip--open' : 'loja-hero__chip--closed'"
            >
              {{ loja.abertoAgora ? 'Aberto agora' : 'Fechado agora' }}
              <template v-if="loja.horarioAbertura && loja.horarioFechamento">
                · {{ loja.horarioAbertura }}–{{ loja.horarioFechamento }}
              </template>
            </span>
          </div>

          <p v-if="enderecoResumo" class="loja-hero__endereco">{{ enderecoResumo }}</p>

          <div class="loja-hero__actions">
            <LandingCtaButton
              label="Agendar agora"
              variant="gold"
              :to="lojaAgendarPath(loja.publicGuid)"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.loja-hero {
  position: relative;
  overflow: hidden;
  padding: 5.5rem 1.25rem 2.5rem;
  background:
    radial-gradient(ellipse 80% 60% at 20% 0%, rgb(201 162 39 / 0.18), transparent 55%),
    radial-gradient(ellipse 70% 50% at 90% 20%, rgb(82 46 95 / 0.45), transparent 50%),
    linear-gradient(165deg, #160e33 0%, #0d0825 55%, #120a2e 100%);
}

.loja-hero__glow {
  pointer-events: none;
  position: absolute;
  inset: auto -10% -30% 40%;
  height: 18rem;
  border-radius: 9999px;
  background: radial-gradient(circle, rgb(201 162 39 / 0.2), transparent 70%);
  filter: blur(40px);
}

.loja-hero__inner {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  max-width: 72rem;
}

.loja-hero__back {
  display: inline-flex;
  margin-bottom: 1.25rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.55);
  text-decoration: none;
  transition: color 0.2s ease;
}

.loja-hero__back:hover {
  color: #fff;
}

.loja-hero__card {
  display: grid;
  gap: 1.5rem;
  align-items: center;
}

@media (min-width: 768px) {
  .loja-hero {
    padding: 6.5rem 2rem 3.25rem;
  }

  .loja-hero__card {
    grid-template-columns: auto 1fr;
    gap: 2rem;
  }
}

.loja-hero__media {
  display: grid;
  place-items: center;
  width: 7.5rem;
  height: 7.5rem;
  overflow: hidden;
  border: 1px solid rgb(201 162 39 / 0.4);
  border-radius: 1.35rem;
  background: #0a0718;
  box-shadow: 0 18px 40px -24px rgb(0 0 0 / 0.8);
}

@media (min-width: 768px) {
  .loja-hero__media {
    width: 9rem;
    height: 9rem;
  }
}

.loja-hero__logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.65rem;
}

.loja-hero__fallback {
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--glow-gold, #c9a227);
}

.loja-hero__categoria {
  margin: 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--glow-gold, #c9a227);
}

.loja-hero__title {
  margin: 0.35rem 0 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  color: #fff;
}

.loja-hero__meta {
  margin-top: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.loja-hero__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.05);
  padding: 0.35rem 0.75rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.9);
}

.loja-hero__chip--muted {
  color: rgb(255 255 255 / 0.55);
}

.loja-hero__chip--open {
  border-color: rgb(110 231 183 / 0.35);
  color: rgb(110 231 183 / 0.95);
}

.loja-hero__chip--closed {
  color: rgb(255 255 255 / 0.55);
}

.loja-hero__endereco {
  margin: 0.85rem 0 0;
  max-width: 36rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  line-height: 1.45;
  color: rgb(255 255 255 / 0.62);
}

.loja-hero__actions {
  margin-top: 1.35rem;
}
</style>
