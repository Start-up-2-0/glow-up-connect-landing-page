<script setup lang="ts">
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'

defineProps<{
  descricao: string | null
  categoria: string | null
}>()

const { isVisible } = useRevealOnScroll()
</script>

<template>
  <section
    ref="revealRoot"
    class="loja-section loja-reveal"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="loja-sobre-title"
  >
    <div class="loja-section__inner">
      <p class="loja-section__eyebrow">Sobre a loja</p>
      <h2 id="loja-sobre-title" class="loja-section__title">
        Conheça o estabelecimento
      </h2>
      <p v-if="descricao" class="loja-sobre__texto">{{ descricao }}</p>
      <p v-else class="loja-sobre__texto loja-sobre__texto--muted">
        Este estabelecimento ainda não publicou uma descrição completa. Explore os serviços e
        profissionais abaixo para conhecer melhor o atendimento.
      </p>

      <ul v-if="categoria" class="loja-sobre__tags" aria-label="Especialidades">
        <li class="loja-sobre__tag">{{ categoria }}</li>
        <li class="loja-sobre__tag">Atendimento com hora marcada</li>
        <li class="loja-sobre__tag">Parceiro Glow Up Connect</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.loja-sobre__texto {
  margin: 1rem 0 0;
  max-width: 40rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.05rem;
  line-height: 1.65;
  color: rgb(255 255 255 / 0.72);
}

.loja-sobre__texto--muted {
  color: rgb(255 255 255 / 0.5);
}

.loja-sobre__tags {
  margin: 1.5rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
}

.loja-sobre__tag {
  border: 1px solid rgb(201 162 39 / 0.28);
  border-radius: 9999px;
  background: rgb(201 162 39 / 0.08);
  padding: 0.4rem 0.85rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgb(255 236 180 / 0.9);
}
</style>
