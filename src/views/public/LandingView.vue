<script setup lang="ts">
import { defineAsyncComponent, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingHero from '@/components/landing/LandingHero.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'
import LandingWhatsappFab from '@/components/landing/LandingWhatsappFab.vue'
import { FEATURE_FLAGS } from '@/config/features'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { useJsonLd, useSeo } from '@/composables/useSeo'
import { APP_NAME } from '@/constants/storageKeys'
import { ROUTE_PATHS } from '@/constants/routes'
import { SITE_URL } from '@/constants/urls'

/** Seções abaixo da dobra — lazy para reduzir JS/imagens no first paint mobile. */
const LandingAudience = defineAsyncComponent(() => import('@/components/landing/LandingAudience.vue'))
const LandingProductShowcase = defineAsyncComponent(
  () => import('@/components/landing/LandingProductShowcase.vue'),
)
const LandingHowItWorks = defineAsyncComponent(() => import('@/components/landing/LandingHowItWorks.vue'))
const LandingFeatures = defineAsyncComponent(() => import('@/components/landing/LandingFeatures.vue'))
const LandingBenefits = defineAsyncComponent(() => import('@/components/landing/LandingBenefits.vue'))
const LandingVisualDemos = defineAsyncComponent(() => import('@/components/landing/LandingVisualDemos.vue'))
const LandingSocialProof = defineAsyncComponent(() => import('@/components/landing/LandingSocialProof.vue'))
const LandingPricing = defineAsyncComponent(() => import('@/components/landing/LandingPricing.vue'))
const LandingFaq = defineAsyncComponent(() => import('@/components/landing/LandingFaq.vue'))
const LandingFinalCta = defineAsyncComponent(() => import('@/components/landing/LandingFinalCta.vue'))

const route = useRoute()
const { scrollToSection } = useLandingScroll()

useSeo({ path: ROUTE_PATHS.HOME })

useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.webp`,
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
    description: FEATURE_FLAGS.lojasHabilitadas
      ? 'Agenda, histórico de clientes e financeiro para barbearias, salões e profissionais da beleza, com agendamento online.'
      : 'Agenda, histórico de clientes e financeiro para barbeiros e cabeleireiros autônomos, com agendamento online.',
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
      <LandingAudience />
      <LandingProductShowcase />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingBenefits />
      <LandingVisualDemos />
      <LandingSocialProof v-if="FEATURE_FLAGS.showSocialProof" />
      <LandingPricing />
      <LandingFaq />
      <LandingFinalCta />
    </main>
    <LandingFooter />
    <LandingWhatsappFab />
  </div>
</template>
