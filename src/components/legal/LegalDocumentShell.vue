<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ROUTE_PATHS } from '@/constants/routes'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
  }>(),
  {
    subtitle: undefined,
  },
)
</script>

<template>
  <article class="legal-document mx-auto max-w-4xl">
    <header class="legal-document__hero">
      <div class="legal-document__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 3.75h7l3 3V20.25H7V3.75Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
          <path d="M14 3.75v3h3M9.5 11h5M9.5 14.5h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>
      </div>
      <div>
        <p class="legal-document__eyebrow">Transparência e segurança</p>
        <h1 class="legal-document__title">
        {{ title }}
        </h1>
        <p v-if="subtitle" class="legal-document__version">{{ subtitle }}</p>
      </div>
    </header>

    <div class="prose-legal text-sm leading-relaxed text-glow-text-subtle">
      <slot />
    </div>

    <footer class="mt-10 flex flex-wrap gap-4 border-t border-glow-border-soft pt-6 text-sm">
      <RouterLink :to="ROUTE_PATHS.TERMOS_DE_USO" class="text-glow-gold-dark hover:underline">
        Termos de uso
      </RouterLink>
      <RouterLink :to="ROUTE_PATHS.POLITICA_COOKIES" class="text-glow-gold-dark hover:underline">
        Política de cookies
      </RouterLink>
      <RouterLink to="/" class="text-glow-gold-dark hover:underline">
        Voltar ao início
      </RouterLink>
    </footer>
  </article>
</template>

<style scoped>
.prose-legal :deep(h2) {
  font-family: Urbanist, sans-serif;
  font-size: 1.075rem;
  font-weight: 700;
  color: var(--glow-text);
}

.legal-document__hero {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--glow-border-soft);
  border-radius: 1.25rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--glow-bg-elevated), color-mix(in srgb, var(--glow-gold-cta) 8%, var(--glow-bg-elevated)));
  box-shadow: var(--glow-shadow-sm);
}

.legal-document__icon { display: flex; width: 3rem; height: 3rem; flex: 0 0 auto; align-items: center; justify-content: center; border-radius: .9rem; background: var(--glow-gold-selected); color: var(--glow-gold-dark); }
.legal-document__icon svg { width: 1.5rem; height: 1.5rem; }
.legal-document__eyebrow { font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--glow-gold-dark); }
.legal-document__title { margin-top: .3rem; font-family: Urbanist, sans-serif; font-size: 2rem; line-height: 1.15; font-weight: 700; color: var(--glow-text); }
.legal-document__version { margin-top: .5rem; font-size: .8rem; color: var(--glow-text-subtle); }

.prose-legal :deep(section) {
  margin-top: .8rem;
  border: 1px solid var(--glow-border-soft);
  border-radius: 1rem;
  padding: 1.25rem 1.4rem;
  background: var(--glow-bg-elevated);
  box-shadow: var(--glow-shadow-sm);
}

.prose-legal :deep(.legal-callout) {
  margin-top: 1rem;
  border: 1px solid color-mix(in srgb, var(--glow-gold-cta) 38%, var(--glow-border-soft));
  border-left: 4px solid var(--glow-gold-cta);
  border-radius: .85rem;
  padding: 1rem;
  background: color-mix(in srgb, var(--glow-gold-cta) 9%, var(--glow-bg-elevated));
  color: var(--glow-text);
}

.prose-legal :deep(.legal-callout strong) { color: var(--glow-gold-dark); }

.prose-legal :deep(ul) {
  margin-left: 1.25rem;
  list-style: disc;
}

.prose-legal :deep(li) {
  margin-top: 0.35rem;
}

.prose-legal :deep(p) {
  margin-top: 0.5rem;
}

@media (max-width: 639px) {
  .legal-document__hero { padding: 1.1rem; }
  .legal-document__icon { width: 2.5rem; height: 2.5rem; }
  .legal-document__title { font-size: 1.65rem; }
  .prose-legal :deep(section) { padding: 1rem; }
}
</style>
