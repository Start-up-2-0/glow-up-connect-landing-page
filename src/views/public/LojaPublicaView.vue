<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingWhatsappFab from '@/components/landing/LandingWhatsappFab.vue'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import LojaPublicaHero from '@/components/loja/LojaPublicaHero.vue'
import LojaPublicaSobre from '@/components/loja/LojaPublicaSobre.vue'
import LojaPublicaServicos from '@/components/loja/LojaPublicaServicos.vue'
import LojaPublicaProfissionais from '@/components/loja/LojaPublicaProfissionais.vue'
import LojaPublicaHorarios from '@/components/loja/LojaPublicaHorarios.vue'
import LojaPublicaAvaliacoes from '@/components/loja/LojaPublicaAvaliacoes.vue'
import LojaPublicaLocalizacao from '@/components/loja/LojaPublicaLocalizacao.vue'
import LojaPublicaCtaBar from '@/components/loja/LojaPublicaCtaBar.vue'
import { useLojaPublica } from '@/composables/useLojaPublica'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import { useDynamicSeo } from '@/composables/useSeo'
import { useHead } from '@unhead/vue'
import { lojaAgendarPath, lojaPublicaPath, ROUTE_PATHS } from '@/constants/routes'
import { APP_NAME } from '@/constants/storageKeys'
import { siteUrl } from '@/constants/urls'

const route = useRoute()
const publicGuid = computed(() => String(route.params.publicGuid ?? ''))
const { isVisible: ctaVisible } = useRevealOnScroll('ctaRoot')

const {
  loja,
  servicos,
  profissionais,
  avaliacoes,
  loading,
  error,
  enderecoCompleto,
  mapsUrl,
  recarregar,
} = useLojaPublica(publicGuid)

useDynamicSeo(() => {
  const l = loja.value
  const path = publicGuid.value ? lojaPublicaPath(publicGuid.value) : ROUTE_PATHS.EXPLORAR_LOJAS
  if (!l) {
    return {
      path,
      title: `Loja | ${APP_NAME}`,
      description: 'Conheça estabelecimentos parceiros do Glow Up Connect e agende online.',
      noindex: Boolean(error.value),
    }
  }

  const cidade = l.endereco?.cidade
  const categoria = l.categoria || 'Estabelecimento'
  const desc =
    l.descricao?.trim()
    || `${l.nome}${cidade ? ` em ${cidade}` : ''} — ${categoria} no Glow Up Connect. Veja serviços, profissionais e agende online.`

  return {
    path,
    title: `${l.nome} | ${APP_NAME}`,
    description: desc.slice(0, 160),
    image: l.logo || undefined,
    ogType: 'website',
  }
})

useHead(() => {
  const l = loja.value
  if (!l) return {}

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: l.nome,
    description: l.descricao || undefined,
    image: l.logo || undefined,
    url: siteUrl(lojaPublicaPath(l.publicGuid)),
    address: l.endereco
      ? {
          '@type': 'PostalAddress',
          streetAddress: l.endereco.logradouro,
          addressLocality: l.endereco.cidade,
          addressRegion: l.endereco.estado,
          addressCountry: 'BR',
        }
      : undefined,
    aggregateRating:
      (l.totalAvaliacoes ?? 0) > 0 && (l.notaMedia ?? 0) > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: l.notaMedia,
            reviewCount: l.totalAvaliacoes,
          }
        : undefined,
  }

  return {
    script: [
      {
        type: 'application/ld+json',
        key: `loja-ld-${l.publicGuid}`,
        innerHTML: JSON.stringify(jsonLd),
      },
    ],
  }
})
</script>

<template>
  <div class="loja-page">
    <LandingNavbar />

    <main id="conteudo-principal">
      <div v-if="loading" class="loja-page__state" role="status">
        <div class="loja-page__spinner" aria-hidden="true" />
        <p>Carregando vitrine da loja…</p>
      </div>

      <div v-else-if="error || !loja" class="loja-page__state loja-page__state--error">
        <h1>Loja não encontrada</h1>
        <p>{{ error || 'Este estabelecimento não está disponível publicamente.' }}</p>
        <div class="loja-page__state-actions">
          <LandingCtaButton
            label="Voltar ao mapa"
            variant="outline"
            :to="ROUTE_PATHS.EXPLORAR_LOJAS"
          />
          <button type="button" class="loja-page__retry" @click="recarregar">
            Tentar novamente
          </button>
        </div>
      </div>

      <template v-else>
        <LojaPublicaHero
          :loja="loja"
          :endereco-resumo="enderecoCompleto"
        />

        <LojaPublicaSobre
          :descricao="loja.descricao?.trim() || null"
          :categoria="loja.categoria?.trim() || null"
          :nome="loja.nome"
          :logo="loja.logo || null"
        />
        <LojaPublicaServicos
          :servicos="servicos"
          :public-guid="loja.publicGuid"
          :categoria="loja.categoria?.trim() || null"
        />
        <LojaPublicaProfissionais
          :profissionais="profissionais"
          :public-guid="loja.publicGuid"
          :categoria="loja.categoria?.trim() || null"
        />
        <LojaPublicaHorarios
          :aberto-agora="loja.abertoAgora"
          :horario-abertura="loja.horarioAbertura"
          :horario-fechamento="loja.horarioFechamento"
        />
        <LojaPublicaAvaliacoes
          :avaliacoes="avaliacoes"
          :nota-media-fallback="loja.notaMedia"
          :total-fallback="loja.totalAvaliacoes"
        />
        <LojaPublicaLocalizacao
          :endereco="loja.endereco"
          :maps-url="mapsUrl"
          :endereco-completo="enderecoCompleto"
        />

        <LandingStorySection
          chapter-index="07"
          chapter-label="Agendar"
          :show-progress="false"
        >
          <div class="relative overflow-hidden px-4 pb-24 pt-6 lg:px-8 lg:pb-28 lg:pt-10">
            <div
              class="absolute inset-0 bg-gradient-to-br from-glow-inverse-surface via-[#1a0f35] to-glow-purple"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-glow-gold/25 blur-[100px]"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-glow-gold-cta/30 blur-[90px]"
              aria-hidden="true"
            />
            <div class="absolute inset-0 landing-grain opacity-[0.06] mix-blend-overlay" aria-hidden="true" />

            <div
              ref="ctaRoot"
              class="landing-reveal relative mx-auto max-w-3xl text-center"
              :class="ctaVisible && 'is-visible'"
            >
              <h2 class="font-montserrat text-3xl font-light leading-[1.15] text-white sm:text-4xl lg:text-5xl">
                Reserve seu horário
                <span class="font-black text-glow-gold"> em poucos passos</span>
              </h2>
              <p class="mx-auto mt-5 max-w-xl font-poppins text-base font-light leading-relaxed text-white/70 sm:text-lg">
                Escolha o serviço, o profissional e o melhor horário — tudo online, sem ligar.
              </p>
              <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <LandingCtaButton
                  label="Agendar agora"
                  variant="gold"
                  class="landing-cta--pulse shadow-[0_0_40px_rgba(146,103,155,0.45)]"
                  :to="lojaAgendarPath(loja.publicGuid)"
                />
                <RouterLink
                  :to="ROUTE_PATHS.EXPLORAR_LOJAS"
                  class="font-satoshi text-sm font-semibold text-white/55 transition hover:text-white"
                >
                  Explorar outras lojas
                </RouterLink>
              </div>
            </div>
          </div>
        </LandingStorySection>

        <LojaPublicaCtaBar
          :public-guid="loja.publicGuid"
          :nome="loja.nome"
        />
      </template>
    </main>

    <LandingWhatsappFab />
  </div>
</template>

<style scoped>
.loja-page {
  min-height: 100dvh;
  background: #0b0818;
  color: #fff;
  animation: loja-page-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.loja-page__state {
  display: grid;
  place-items: center;
  gap: 0.75rem;
  min-height: 70dvh;
  padding: 6rem 1.5rem 3rem;
  text-align: center;
  font-family: Poppins, ui-sans-serif, system-ui, sans-serif;
  color: rgb(255 255 255 / 0.7);
}

.loja-page__state h1 {
  margin: 0;
  font-family: Montserrat, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.75rem;
  color: #fff;
}

.loja-page__state-actions {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.loja-page__retry {
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: 9999px;
  background: transparent;
  padding: 0.65rem 1.25rem;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
}

.loja-page__spinner {
  width: 2.25rem;
  height: 2.25rem;
  border: 2px solid rgb(255 255 255 / 0.15);
  border-top-color: var(--glow-gold, #c9a227);
  border-radius: 9999px;
  animation: loja-spin 0.8s linear infinite;
}

@keyframes loja-page-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes loja-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .loja-page {
    animation: none;
  }

  .loja-page__spinner {
    animation: none;
  }
}
</style>
