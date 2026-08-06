<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useConsent } from '@/composables/useConsent'
import { ROUTE_PATHS } from '@/constants/routes'

const { acceptAll, rejectNonEssential, openPreferences } = useConsent()
</script>

<template>
  <div
    class="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-glow-inverse-surface/95 p-4 shadow-lg backdrop-blur-md sm:p-5"
    role="dialog"
    aria-labelledby="cookie-banner-title"
    aria-describedby="cookie-banner-desc"
  >
    <div class="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="min-w-0 flex-1">
        <p id="cookie-banner-title" class="font-satoshi text-sm font-semibold text-white">
          Cookies e serviços de terceiros
        </p>
        <p id="cookie-banner-desc" class="mt-1 text-sm text-white/65">
          Usamos cookies essenciais para login e preferências. Com sua autorização, também
          compartilhamos dados com parceiros como Mercado Pago e APIs de CEP para pagamentos e
          cadastro de endereço.
          <RouterLink :to="ROUTE_PATHS.POLITICA_COOKIES" class="font-medium text-glow-gold hover:underline">
            Saiba mais
          </RouterLink>
        </p>
      </div>

      <div class="flex flex-wrap gap-2 lg:shrink-0">
        <button
          type="button"
          class="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5"
          @click="rejectNonEssential"
        >
          Apenas essenciais
        </button>
        <button
          type="button"
          class="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
          @click="openPreferences"
        >
          Personalizar
        </button>
        <button
          type="button"
          class="rounded-lg bg-glow-gold-cta px-4 py-2 text-sm font-medium text-white hover:brightness-95"
          @click="acceptAll"
        >
          Aceitar todos
        </button>
      </div>
    </div>
  </div>
</template>
