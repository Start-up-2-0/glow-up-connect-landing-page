<script setup lang="ts">
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import type { ProfissionalVitrinePublico } from '@/types/avaliacao.types'

defineProps<{
  profissionais: ProfissionalVitrinePublico[]
}>()

const { isVisible } = useRevealOnScroll()
</script>

<template>
  <section
    ref="revealRoot"
    class="loja-section loja-reveal"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="loja-profs-title"
  >
    <div class="loja-section__inner">
      <div class="loja-section__head">
        <div>
          <p class="loja-section__eyebrow">Profissionais</p>
          <h2 id="loja-profs-title" class="loja-section__title">
            Quem vai te atender
          </h2>
        </div>
        <span class="loja-section__count" aria-hidden="true">{{ profissionais.length }}</span>
      </div>

      <p v-if="profissionais.length === 0" class="loja-empty">
        Nenhum profissional disponível para exibição pública no momento.
      </p>

      <ul v-else class="loja-profs__grid">
        <li
          v-for="(prof, index) in profissionais"
          :key="prof.publicGuid"
          class="loja-prof"
          :style="{ '--delay': `${Math.min(index, 8) * 45}ms` }"
        >
          <div class="loja-prof__avatar">
            <img
              v-if="prof.logo"
              :src="prof.logo"
              :alt="`Foto de ${prof.nomePublico}`"
              width="72"
              height="72"
              loading="lazy"
              decoding="async"
            />
            <span v-else aria-hidden="true">{{ prof.nomePublico.charAt(0) }}</span>
          </div>
          <div class="loja-prof__copy">
            <h3 class="loja-prof__nome">{{ prof.nomePublico }}</h3>
            <p v-if="prof.biografia?.trim()" class="loja-prof__bio">{{ prof.biografia }}</p>
            <p v-else class="loja-prof__bio loja-prof__bio--muted">Profissional parceiro</p>
            <p
              v-if="(prof.notaMedia ?? 0) > 0"
              class="loja-prof__nota"
            >
              ★ {{ Number(prof.notaMedia).toFixed(1).replace('.', ',') }}
              <span v-if="(prof.totalAvaliacoes ?? 0) > 0">
                ({{ prof.totalAvaliacoes }})
              </span>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.loja-profs__grid {
  margin: 1.75rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
  list-style: none;
}

@media (min-width: 640px) {
  .loja-profs__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .loja-profs__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.loja-prof {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: 1.25rem;
  background: rgb(255 255 255 / 0.04);
  padding: 1.1rem;
  transition: border-color 0.25s ease, transform 0.25s ease;
}

.loja-reveal.is-visible .loja-prof {
  animation: loja-card-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--delay, 0ms);
}

.loja-prof:hover {
  border-color: rgb(255 255 255 / 0.22);
  transform: translateY(-2px);
}

.loja-prof__avatar {
  display: grid;
  place-items: center;
  width: 4.5rem;
  height: 4.5rem;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid rgb(201 162 39 / 0.35);
  border-radius: 9999px;
  background: #120a2a;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--glow-gold, #c9a227);
}

.loja-prof__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loja-prof__nome {
  margin: 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
}

.loja-prof__bio {
  margin: 0.35rem 0 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  line-height: 1.45;
  color: rgb(255 255 255 / 0.55);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.loja-prof__bio--muted {
  color: rgb(255 255 255 / 0.38);
}

.loja-prof__nota {
  margin: 0.55rem 0 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgb(255 236 180 / 0.9);
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
  .loja-reveal.is-visible .loja-prof {
    animation: none;
  }
}
</style>
