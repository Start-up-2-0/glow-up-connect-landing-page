<script setup lang="ts">
withDefaults(
  defineProps<{
    imagem?: string | null
    alt?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    imagem: null,
    alt: 'Imagem do serviço',
    size: 'md',
  },
)
</script>

<template>
  <div class="servico-imagem" :class="`servico-imagem--${size}`" aria-hidden="true">
    <img v-if="imagem" :src="imagem" :alt="alt" class="servico-imagem__img" />
    <svg v-else class="servico-imagem__fallback" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="12" width="48" height="40" rx="6" stroke="currentColor" stroke-width="2" />
      <path d="M20 24H44M20 32H36" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </div>
</template>

<style scoped>
.servico-imagem {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.servico-imagem--sm { width: 2.75rem; height: 2.75rem; }
.servico-imagem--md { width: 3.5rem; height: 3.5rem; }
.servico-imagem--lg { width: 4.5rem; height: 4.5rem; }

.servico-imagem__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.servico-imagem__fallback {
  width: 60%;
  height: 60%;
  color: rgba(255, 255, 255, 0.45);
}
</style>
