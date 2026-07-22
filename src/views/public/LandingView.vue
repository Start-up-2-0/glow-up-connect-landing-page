<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingHero from '@/components/landing/LandingHero.vue'
import LandingAbout from '@/components/landing/LandingAbout.vue'
import LandingBenefits from '@/components/landing/LandingBenefits.vue'
import LandingStats from '@/components/landing/LandingStats.vue'
import LandingPricing from '@/components/landing/LandingPricing.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'
import LandingWhatsappFab from '@/components/landing/LandingWhatsappFab.vue'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { useJsonLd, useSeo } from '@/composables/useSeo'
import { APP_NAME } from '@/constants/storageKeys'
import { ROUTE_PATHS } from '@/constants/routes'
import { SITE_URL } from '@/constants/urls'

const route = useRoute()
const { scrollToSection } = useLandingScroll()

useSeo({ path: ROUTE_PATHS.HOME })

useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    email: 'contato@glowup.com.br',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_NAME,
    url: SITE_URL,
    inLanguage: 'pt-BR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BRL',
      lowPrice: '0',
      offerCount: '3',
    },
    url: SITE_URL,
  },
])

function handleHashScroll() {
  if (route.hash) {
    requestAnimationFrame(() => scrollToSection(route.hash))
  }
}

onMounted(handleHashScroll)
watch(() => route.hash, handleHashScroll)
</script>

<template>
  <div class="overflow-x-hidden bg-glow-surface">
    <LandingNavbar />
    <main id="conteudo-principal">
      <LandingHero />
      <LandingAbout />
      <LandingBenefits />
      <LandingStats />
      <LandingPricing />
    </main>
    <LandingFooter />
    <LandingWhatsappFab />
  </div>
</template>
