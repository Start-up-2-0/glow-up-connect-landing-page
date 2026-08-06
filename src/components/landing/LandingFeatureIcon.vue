<script setup lang="ts">
import type { FeatureIconId } from '@/constants/landing'

defineProps<{
  name: FeatureIconId
}>()
</script>

<template>
  <svg
    class="size-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'agenda' || name === 'online'">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path v-if="name === 'online'" d="M8 14h.01M12 14h.01M16 14h.01M8 18h8" />
      <path v-else d="M8 14h8M8 18h5" />
    </template>

    <template v-else-if="name === 'clientes'">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </template>

    <template v-else-if="name === 'financeiro'">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </template>

    <template v-else-if="name === 'comissao'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </template>

    <template v-else-if="name === 'equipe'">
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
      <path d="M16 14.5a4 4 0 0 1 5 3.8V20" />
    </template>

    <template v-else-if="name === 'relatorios'">
      <path d="M4 19V5M4 19h16" />
      <path d="M8 16v-5M13 16V8M18 16v-3" />
    </template>

    <template v-else-if="name === 'explorar'">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </template>

    <template v-else-if="name === 'automacao'">
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
      <circle cx="12" cy="12" r="3" />
    </template>

    <template v-else-if="name === 'notificacao'">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </template>

    <template v-else-if="name === 'dashboard'">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </template>

    <template v-else-if="name === 'servicos'">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </template>
  </svg>
</template>
