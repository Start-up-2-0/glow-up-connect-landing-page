<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingHero from '@/components/landing/LandingHero.vue'
import LandingProductShowcase from '@/components/landing/LandingProductShowcase.vue'
import LandingHowItWorks from '@/components/landing/LandingHowItWorks.vue'
import LandingFeatures from '@/components/landing/LandingFeatures.vue'
import LandingBenefits from '@/components/landing/LandingBenefits.vue'
import LandingVisualDemos from '@/components/landing/LandingVisualDemos.vue'
import LandingSocialProof from '@/components/landing/LandingSocialProof.vue'
import LandingPricing from '@/components/landing/LandingPricing.vue'
import LandingFaq from '@/components/landing/LandingFaq.vue'
import LandingFinalCta from '@/components/landing/LandingFinalCta.vue'
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
    description:
      'Plataforma de gestão para barbearias e salões: agenda, clientes, financeiro, comissões e equipe.',
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
  <div class="flex min-h-dvh flex-col overflow-x-hidden bg-glow-canvas text-glow-text">
    <LandingNavbar />
    <main id="conteudo-principal" class="flex-1">
      <LandingHero />
      <LandingProductShowcase />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingBenefits />
      <LandingVisualDemos />
      <LandingSocialProof />
      <LandingPricing />
      <LandingFaq />
      <LandingFinalCta />
    </main>
    <LandingFooter />
    <LandingWhatsappFab />
  </div>
</template>
