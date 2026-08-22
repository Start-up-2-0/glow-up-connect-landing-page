<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { LANDING_SECTIONS } from '@/constants/landing'
import { navLinksVisiveis } from '@/utils/tipoAssinatura'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants/routes'
import { APP_URL } from '@/constants/urls'
import { useLandingScroll } from '@/composables/useLandingScroll'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import LandingThemeToggle from '@/components/landing/LandingThemeToggle.vue'

const route = useRoute()
const { goToSection, goToNavLink } = useLandingScroll()
const menuOpen = ref(false)
const activeSection = ref<string>(LANDING_SECTIONS.inicio)
const scrolled = ref(false)

const navLinks = navLinksVisiveis()
const isExplorarPage = computed(() => route.path === ROUTE_PATHS.EXPLORAR_LOJAS)
const isLojaPublicaPage = computed(() => route.name === ROUTE_NAMES.LOJA_PUBLICA)
const forceSolidNav = computed(() => isExplorarPage.value || isLojaPublicaPage.value)

async function handleNavClick(link: (typeof navLinks)[number]) {
  menuOpen.value = false
  activeSection.value = link.id
  await goToNavLink(link)
}

async function handleLogoClick() {
  menuOpen.value = false
  activeSection.value = LANDING_SECTIONS.inicio
  if (route.path !== ROUTE_PATHS.HOME) {
    await goToSection(LANDING_SECTIONS.inicio)
    return
  }
  await goToSection(LANDING_SECTIONS.inicio)
}

function updateActiveSection() {
  if (typeof document === 'undefined') return

  if (isExplorarPage.value) {
    activeSection.value = LANDING_SECTIONS.explorarLojas
    return
  }

  if (route.path !== ROUTE_PATHS.HOME) return

  const offset = 120
  const sections = [
    LANDING_SECTIONS.inicio,
    ...navLinks.filter((l) => !l.path).map((l) => l.id),
  ]
  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections[i])
    if (el && el.getBoundingClientRect().top <= offset) {
      activeSection.value = sections[i]
      return
    }
  }
  activeSection.value = LANDING_SECTIONS.inicio
}

function handleScroll() {
  scrolled.value = window.scrollY > 24
  updateActiveSection()
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', handleScroll))

watch(
  () => route.path,
  () => {
    updateActiveSection()
  },
  { immediate: true },
)
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="
      scrolled || menuOpen || forceSolidNav
        ? 'border-b border-glow-border-soft bg-glow-canvas py-3 shadow-glow-md backdrop-blur-md'
        : 'bg-transparent py-5'
    "
  >
    <div class="mx-auto flex max-w-[1280px] items-center justify-between px-4 lg:px-8">
      <RouterLink
        :to="ROUTE_PATHS.HOME"
        class="group font-satoshi text-xl text-glow-text sm:text-2xl"
        @click.prevent="handleLogoClick"
      >
        <span class="font-light">GlowUp </span>
        <span class="font-black">Connect</span>
      </RouterLink>

      <nav
        class="hidden items-center gap-1 xl:flex"
        aria-label="Navegação principal"
      >
        <button
          v-for="link in navLinks"
          :key="link.id"
          type="button"
          class="rounded-full px-3 py-2 font-satoshi text-sm transition"
          :class="
            activeSection === link.id
              ? 'bg-glow-hover-surface font-semibold text-glow-text'
              : 'font-normal text-glow-text-subtle hover:text-glow-text'
          "
          @click="handleNavClick(link)"
        >
          {{ link.label }}
        </button>
      </nav>

      <div class="hidden items-center gap-3 lg:flex">
        <LandingThemeToggle />
        <a
          :href="`${APP_URL}/auth/login`"
          class="font-satoshi text-sm text-glow-text-soft transition hover:text-glow-text"
        >
          Entrar
        </a>
        <LandingCtaButton
          :href="`${APP_URL}/auth/register`"
          label="Criar conta"
          size="sm"
          class="!h-10 !rounded-full !px-4 !text-sm"
        />
      </div>

      <div class="flex items-center gap-2 lg:hidden">
        <LandingThemeToggle />
        <button
          type="button"
          class="flex size-10 items-center justify-center rounded-xl text-glow-text"
          :aria-label="menuOpen ? 'Fechar menu' : 'Abrir menu'"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="!menuOpen" d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
            <path v-else d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="menuOpen"
        class="mx-4 mt-3 rounded-2xl border border-glow-border-soft bg-glow-surface p-4 shadow-glow-lg backdrop-blur-xl lg:hidden"
      >
        <nav class="flex flex-col gap-1" aria-label="Menu mobile">
          <button
            v-for="link in navLinks"
            :key="link.id"
            type="button"
            class="rounded-xl px-3 py-2.5 text-left font-satoshi text-base text-glow-text"
            :class="activeSection === link.id ? 'bg-glow-hover-surface font-semibold' : 'font-normal'"
            @click="handleNavClick(link)"
          >
            {{ link.label }}
          </button>
          <a
            :href="`${APP_URL}/auth/login`"
            class="rounded-xl px-3 py-2.5 font-satoshi text-base text-glow-text-soft"
            @click="menuOpen = false"
          >
            Entrar
          </a>
          <a
            :href="`${APP_URL}/auth/register`"
            class="rounded-xl px-3 py-2.5 font-satoshi text-base text-glow-text-soft"
            @click="menuOpen = false"
          >
            Cadastrar
          </a>
          <LandingCtaButton
            :href="`${APP_URL}/auth/register`"
            label="Criar conta"
            class="w-full justify-center"
            @click="menuOpen = false"
          />
        </nav>
      </div>
    </Transition>
  </header>
</template>
