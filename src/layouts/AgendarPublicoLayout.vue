<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ROUTE_PATHS } from '@/constants/routes'
</script>

<template>
  <div class="agendar-publico-shell">
    <header class="agendar-publico-header">
      <RouterLink :to="ROUTE_PATHS.HOME" class="agendar-publico-logo">
        <span>GlowUp </span>
        <span class="font-black">Connect</span>
      </RouterLink>
    </header>

    <main class="agendar-publico-main">
      <slot />
    </main>
  </div>
</template>
