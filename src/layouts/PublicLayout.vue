<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ROUTE_PATHS } from '@/constants/routes'
import { APP_NAME } from '@/constants/storageKeys'
import { APP_URL } from '@/constants/urls'
</script>

<template>
  <div class="min-h-dvh bg-glow-canvas">
    <header class="border-b border-glow-border-soft bg-glow-surface">
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
        <RouterLink to="/" class="font-urbanist text-lg font-semibold text-glow-text">
          {{ APP_NAME }}
        </RouterLink>
        <div class="flex items-center gap-3">
          <a
            :href="`${APP_URL}/auth/login`"
            class="text-sm font-medium text-glow-text-subtle hover:text-glow-text"
          >
            Entrar
          </a>
          <a
            :href="`${APP_URL}/auth/register`"
            class="rounded-lg bg-glow-gold px-4 py-2 text-sm font-medium text-white hover:brightness-95"
          >
            Criar conta
          </a>
        </div>
      </div>
    </header>
    <main id="conteudo-principal" class="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-12">
      <slot />
    </main>
    <footer class="border-t border-glow-border-soft bg-glow-surface py-6">
      <div class="mx-auto flex max-w-7xl flex-wrap justify-center gap-4 px-4 text-sm text-glow-text-subtle lg:px-6">
        <RouterLink :to="ROUTE_PATHS.TERMOS_DE_USO" class="hover:text-glow-text">Termos de uso</RouterLink>
        <RouterLink :to="ROUTE_PATHS.POLITICA_COOKIES" class="hover:text-glow-text">Política de cookies</RouterLink>
      </div>
    </footer>
  </div>
</template>
