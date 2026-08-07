<script setup lang="ts">
import { computed } from 'vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import type { EnderecoResumo } from '@/types/estabelecimento.types'

const props = defineProps<{
  endereco: EnderecoResumo | null
  mapsUrl: string | null
  enderecoCompleto: string | null
}>()

const { isVisible } = useRevealOnScroll()

const embedUrl = computed(() => {
  if (!props.endereco) return null
  const q = encodeURIComponent(
    [props.endereco.logradouro, props.endereco.bairro, props.endereco.cidade, props.endereco.estado, 'Brasil']
      .filter(Boolean)
      .join(', '),
  )
  return `https://maps.google.com/maps?q=${q}&z=15&output=embed`
})
</script>

<template>
  <section
    ref="revealRoot"
    class="loja-section loja-reveal"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="loja-local-title"
  >
    <div class="loja-section__inner">
      <p class="loja-section__eyebrow">Localização</p>
      <h2 id="loja-local-title" class="loja-section__title">
        Como chegar
      </h2>

      <div class="loja-local__layout">
        <div class="loja-local__info">
          <p v-if="enderecoCompleto" class="loja-local__endereco">{{ enderecoCompleto }}</p>
          <p v-else class="loja-empty">Endereço não informado.</p>

          <a
            v-if="mapsUrl"
            :href="mapsUrl"
            class="loja-local__route"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir rotas no mapa
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>

        <div v-if="embedUrl" class="loja-local__map">
          <iframe
            :src="embedUrl"
            title="Mapa da localização da loja"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.loja-local__layout {
  margin-top: 1.5rem;
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 900px) {
  .loja-local__layout {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.3fr);
    align-items: stretch;
    gap: 1.5rem;
  }
}

.loja-local__endereco {
  margin: 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.05rem;
  line-height: 1.55;
  color: rgb(255 255 255 / 0.78);
}

.loja-local__route {
  margin-top: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--glow-gold, #c9a227);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.loja-local__route:hover {
  opacity: 0.85;
}

.loja-local__map {
  overflow: hidden;
  min-height: 16rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: 1.25rem;
  background: #0d0820;
  box-shadow: 0 24px 48px -32px rgb(0 0 0 / 0.8);
}

.loja-local__map iframe {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 16rem;
  border: 0;
  filter: grayscale(0.25) contrast(1.05);
}
</style>
