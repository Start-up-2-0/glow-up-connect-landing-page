<script setup lang="ts">
import { computed } from 'vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'

const props = defineProps<{
  abertoAgora?: boolean | null
  horarioAbertura?: string | null
  horarioFechamento?: string | null
}>()

const { isVisible } = useRevealOnScroll()

const hojeLabel = computed(() => {
  const open = props.horarioAbertura
  const close = props.horarioFechamento
  if (open && close) return `${open} – ${close}`
  return null
})

const statusLabel = computed(() => {
  if (props.abertoAgora === true) return 'Aberto agora'
  if (props.abertoAgora === false) return 'Fechado agora'
  return null
})
</script>

<template>
  <section
    ref="revealRoot"
    class="loja-section loja-reveal"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="loja-horarios-title"
  >
    <div class="loja-section__inner loja-horarios">
      <div>
        <p class="loja-section__eyebrow">Horário</p>
        <h2 id="loja-horarios-title" class="loja-section__title">
          Funcionamento
        </h2>
      </div>

      <div class="loja-horarios__card">
        <div class="loja-horarios__today">
          <p class="loja-horarios__day">Hoje</p>
          <p
            v-if="statusLabel"
            class="loja-horarios__status"
            :class="abertoAgora ? 'is-open' : 'is-closed'"
          >
            {{ statusLabel }}
          </p>
          <p v-if="hojeLabel" class="loja-horarios__range">{{ hojeLabel }}</p>
          <p v-else class="loja-horarios__range loja-horarios__range--muted">
            Horário de hoje não informado
          </p>
        </div>
        <p class="loja-horarios__hint">
          Os horários podem variar por dia. No agendamento você vê apenas os slots realmente
          disponíveis.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.loja-horarios__card {
  margin-top: 1.5rem;
  max-width: 28rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: 1.35rem;
  background:
    linear-gradient(145deg, rgb(201 162 39 / 0.1), transparent 55%),
    rgb(255 255 255 / 0.04);
  padding: 1.35rem 1.4rem;
}

.loja-horarios__day {
  margin: 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.45);
}

.loja-horarios__status {
  margin: 0.55rem 0 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
}

.loja-horarios__status.is-open {
  color: rgb(110 231 183 / 0.95);
}

.loja-horarios__status.is-closed {
  color: rgb(255 255 255 / 0.55);
}

.loja-horarios__range {
  margin: 0.35rem 0 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  color: rgb(255 255 255 / 0.8);
}

.loja-horarios__range--muted {
  color: rgb(255 255 255 / 0.4);
}

.loja-horarios__hint {
  margin: 1rem 0 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.85rem;
  line-height: 1.45;
  color: rgb(255 255 255 / 0.45);
}
</style>
