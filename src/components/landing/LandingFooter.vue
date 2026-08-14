<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  FOOTER_CONTACT,
  FOOTER_TAGLINE,
  LANDING_SECTIONS,
  NAV_LINKS,
} from '@/constants/landing'
import { ROUTE_PATHS } from '@/constants/routes'
import { APP_URL } from '@/constants/urls'
import { useLandingScroll } from '@/composables/useLandingScroll'

const { goToSection, goToNavLink } = useLandingScroll()

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', external: true },
  { label: 'WhatsApp', href: `https://wa.me/5579999999999`, external: true },
] as const
</script>

<template>
  <footer class="relative overflow-hidden bg-glow-canvas text-glow-text">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glow-gold/40 to-transparent"
      aria-hidden="true"
    />

    <div class="mx-auto max-w-[1280px] px-4 py-14 lg:px-8 lg:py-20">
      <div class="grid grid-cols-3 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
        <div class="col-span-3 lg:col-span-1">
          <RouterLink
            :to="ROUTE_PATHS.HOME"
            class="font-satoshi text-xl text-glow-text sm:text-2xl"
            @click="goToSection(LANDING_SECTIONS.inicio)"
          >
            <span class="font-light">GlowUp </span>
            <span class="font-black">Connect</span>
          </RouterLink>
          <p class="mt-5 max-w-sm font-poppins text-sm font-light leading-relaxed text-glow-text-muted">
            {{ FOOTER_TAGLINE }}
          </p>
          <p class="mt-6 font-satoshi text-sm font-black text-glow-gold">
            {{ FOOTER_CONTACT.hashtag }}
          </p>
        </div>

        <div class="min-w-0">
          <p class="font-montserrat text-xs font-semibold text-glow-text sm:text-sm">Navegação</p>
          <nav class="mt-3 flex flex-col gap-2 sm:mt-4 sm:gap-2.5" aria-label="Rodapé — navegação">
            <button
              v-for="link in NAV_LINKS"
              :key="link.id"
              type="button"
              class="text-left font-satoshi text-xs text-glow-text-muted transition hover:text-glow-text sm:text-sm"
              @click="goToNavLink(link)"
            >
              {{ link.label }}
            </button>
            <button
              type="button"
              class="text-left font-satoshi text-xs text-glow-text-muted transition hover:text-glow-text sm:text-sm"
              @click="goToSection(LANDING_SECTIONS.inicio)"
            >
              Início
            </button>
          </nav>
        </div>

        <div class="min-w-0">
          <p class="font-montserrat text-xs font-semibold text-glow-text sm:text-sm">Conta</p>
          <nav class="mt-3 flex flex-col gap-2 sm:mt-4 sm:gap-2.5" aria-label="Rodapé — conta">
            <a
              :href="`${APP_URL}/auth/login`"
              class="font-satoshi text-xs text-glow-text-muted transition hover:text-glow-text sm:text-sm"
            >
              Entrar
            </a>
            <a
              :href="`${APP_URL}/auth/register`"
              class="font-satoshi text-xs text-glow-text-muted transition hover:text-glow-text sm:text-sm"
            >
              Criar conta
            </a>
            <button
              type="button"
              class="text-left font-satoshi text-xs text-glow-text-muted transition hover:text-glow-text sm:text-sm"
              @click="goToSection(LANDING_SECTIONS.planos)"
            >
              Ver planos
            </button>
          </nav>
        </div>

        <div class="min-w-0">
          <p class="font-montserrat text-xs font-semibold text-glow-text sm:text-sm">Contato</p>
          <div class="mt-3 flex flex-col gap-2 font-satoshi text-xs text-glow-text-muted sm:mt-4 sm:gap-2.5 sm:text-sm">
            <a :href="FOOTER_CONTACT.emailHref" class="break-all transition hover:text-glow-text">
              {{ FOOTER_CONTACT.email }}
            </a>
            <a :href="FOOTER_CONTACT.phoneHref" class="transition hover:text-glow-text">
              {{ FOOTER_CONTACT.phone }}
            </a>
          </div>
          <div class="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-full border border-glow-border-soft px-2.5 py-1 text-center font-satoshi text-[10px] text-glow-text-subtle transition hover:border-glow-gold/40 hover:text-glow-text sm:px-3 sm:py-1.5 sm:text-xs"
            >
              {{ social.label }}
            </a>
          </div>
        </div>
      </div>

      <div
        class="mt-14 flex flex-col gap-4 border-t border-glow-border-soft pt-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="font-satoshi text-xs text-glow-text-muted">
          {{ new Date().getFullYear() }} Glow Up Connect. Todos os direitos reservados.
        </p>
        <nav class="flex flex-wrap gap-x-5 gap-y-2 font-satoshi text-xs text-glow-text-muted" aria-label="Políticas">
          <RouterLink :to="ROUTE_PATHS.TERMOS_DE_USO" class="transition hover:text-glow-text">
            Termos de uso
          </RouterLink>
          <RouterLink :to="ROUTE_PATHS.POLITICA_COOKIES" class="transition hover:text-glow-text">
            Política de cookies
          </RouterLink>
        </nav>
      </div>
    </div>
  </footer>
</template>
