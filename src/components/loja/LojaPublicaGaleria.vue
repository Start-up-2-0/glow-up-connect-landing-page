<script setup lang="ts">
import { computed } from 'vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'

const props = defineProps<{
  nome: string
  logo: string | null
}>()

const { isVisible } = useRevealOnScroll()

const tiles = computed(() => {
  const items: Array<{ key: string; src: string | null; label: string }> = []
  if (props.logo) {
    items.push({ key: 'logo', src: props.logo, label: `Identidade visual de ${props.nome}` })
  }
  items.push(
    { key: 'ambiente', src: null, label: 'Ambiente' },
    { key: 'atendimento', src: null, label: 'Atendimento' },
    { key: 'trabalhos', src: null, label: 'Trabalhos' },
  )
  return items.slice(0, 4)
})
</script>

<template>
  <section
    ref="revealRoot"
    class="loja-section loja-reveal"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="loja-galeria-title"
  >
    <div class="loja-section__inner">
      <p class="loja-section__eyebrow">Galeria</p>
      <h2 id="loja-galeria-title" class="loja-section__title">
        Visual da loja
      </h2>
      <p class="loja-galeria__lead">
        Uma prévia da identidade do estabelecimento. Fotos de ambiente e trabalhos podem ser
        adicionadas pelo parceiro.
      </p>

      <ul class="loja-galeria__grid">
        <li
          v-for="(tile, index) in tiles"
          :key="tile.key"
          class="loja-galeria__tile"
          :class="{ 'loja-galeria__tile--hero': index === 0 }"
          :style="{ '--delay': `${index * 60}ms` }"
        >
          <img
            v-if="tile.src"
            :src="tile.src"
            :alt="tile.label"
            loading="lazy"
            decoding="async"
            class="loja-galeria__img"
          />
          <div v-else class="loja-galeria__placeholder">
            <span>{{ tile.label }}</span>
            <small>Em breve</small>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.loja-galeria__lead {
  margin: 0.75rem 0 0;
  max-width: 36rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgb(255 255 255 / 0.55);
}

.loja-galeria__grid {
  margin: 1.75rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
  list-style: none;
  grid-template-columns: 1fr 1fr;
}

@media (min-width: 768px) {
  .loja-galeria__grid {
    grid-template-columns: 1.4fr 1fr 1fr;
    grid-template-rows: 11rem 11rem;
  }

  .loja-galeria__tile--hero {
    grid-row: 1 / span 2;
  }
}

.loja-galeria__tile {
  position: relative;
  overflow: hidden;
  min-height: 8.5rem;
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: 1.15rem;
  background: #120a2a;
}

.loja-reveal.is-visible .loja-galeria__tile {
  animation: loja-card-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--delay, 0ms);
}

.loja-galeria__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1.5rem;
  background:
    radial-gradient(circle at 30% 20%, rgb(201 162 39 / 0.18), transparent 55%),
    #0d0820;
}

.loja-galeria__placeholder {
  display: grid;
  place-content: center;
  gap: 0.25rem;
  height: 100%;
  min-height: inherit;
  text-align: center;
  background:
    linear-gradient(145deg, rgb(82 46 95 / 0.35), transparent 60%),
    #0f0a22;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.55);
}

.loja-galeria__placeholder small {
  font-size: 0.72rem;
  font-weight: 500;
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
  .loja-reveal.is-visible .loja-galeria__tile {
    animation: none;
  }
}
</style>
