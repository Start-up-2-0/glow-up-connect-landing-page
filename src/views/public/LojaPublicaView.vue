<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'
import LandingWhatsappFab from '@/components/landing/LandingWhatsappFab.vue'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import LojaPublicaHero from '@/components/loja/LojaPublicaHero.vue'
import LojaPublicaSobre from '@/components/loja/LojaPublicaSobre.vue'
import LojaPublicaServicos from '@/components/loja/LojaPublicaServicos.vue'
import LojaPublicaProfissionais from '@/components/loja/LojaPublicaProfissionais.vue'
import LojaPublicaHorarios from '@/components/loja/LojaPublicaHorarios.vue'
import LojaPublicaGaleria from '@/components/loja/LojaPublicaGaleria.vue'
import LojaPublicaAvaliacoes from '@/components/loja/LojaPublicaAvaliacoes.vue'
import LojaPublicaLocalizacao from '@/components/loja/LojaPublicaLocalizacao.vue'
import LojaPublicaCtaBar from '@/components/loja/LojaPublicaCtaBar.vue'
import { useLojaPublica } from '@/composables/useLojaPublica'
import { useDynamicSeo } from '@/composables/useSeo'
import { useHead } from '@unhead/vue'
import { lojaAgendarPath, lojaPublicaPath, ROUTE_PATHS } from '@/constants/routes'
import { APP_NAME } from '@/constants/storageKeys'
import { siteUrl } from '@/constants/urls'

const route = useRoute()
const publicGuid = computed(() => String(route.params.publicGuid ?? ''))

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

    <main id="conteudo-principal" class="loja-page__main">
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

        <div class="loja-page__body">
          <LojaPublicaSobre
            :descricao="loja.descricao?.trim() || null"
            :categoria="loja.categoria?.trim() || null"
          />
          <LojaPublicaServicos
            :servicos="servicos"
            :public-guid="loja.publicGuid"
          />
          <LojaPublicaProfissionais :profissionais="profissionais" />
          <LojaPublicaHorarios
            :aberto-agora="loja.abertoAgora"
            :horario-abertura="loja.horarioAbertura"
            :horario-fechamento="loja.horarioFechamento"
          />
          <LojaPublicaGaleria
            :nome="loja.nome"
            :logo="loja.logo || null"
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

          <section class="loja-section loja-final-cta" aria-labelledby="loja-final-cta-title">
            <div class="loja-section__inner loja-final-cta__inner">
              <p class="loja-section__eyebrow">Agendamento</p>
              <h2 id="loja-final-cta-title" class="loja-section__title">
                Reserve seu horário em poucos passos
              </h2>
              <p class="loja-final-cta__text">
                Escolha o serviço, o profissional e o melhor horário — tudo online, sem ligar.
              </p>
              <LandingCtaButton
                label="Agendar agora"
                variant="gold"
                :to="lojaAgendarPath(loja.publicGuid)"
              />
              <RouterLink
                :to="ROUTE_PATHS.EXPLORAR_LOJAS"
                class="loja-final-cta__back"
              >
                Explorar outras lojas
              </RouterLink>
            </div>
          </section>
        </div>

        <LojaPublicaCtaBar
          :public-guid="loja.publicGuid"
          :nome="loja.nome"
        />
      </template>
    </main>

    <LandingFooter />
    <LandingWhatsappFab />
  </div>
</template>

<style>
/* Shared section chrome for loja pública */
.loja-section {
  padding: 3.25rem 1.25rem;
  border-top: 1px solid rgb(255 255 255 / 0.06);
}

@media (min-width: 768px) {
  .loja-section {
    padding: 4.25rem 2rem;
  }
}

.loja-section__inner {
  margin: 0 auto;
  max-width: 72rem;
}

.loja-section__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.loja-section__eyebrow {
  margin: 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--glow-gold, #c9a227);
}

.loja-section__title {
  margin: 0.4rem 0 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.45rem, 3vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
}

.loja-section__count {
  display: inline-grid;
  place-items: center;
  min-width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: rgb(201 162 39 / 0.18);
  padding: 0 0.55rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--glow-gold, #c9a227);
}

.loja-empty {
  margin: 1.25rem 0 0;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  color: rgb(255 255 255 / 0.45);
}

.loja-reveal {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.loja-reveal.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .loja-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>

<style scoped>
.loja-page {
  min-height: 100dvh;
  background:
    radial-gradient(ellipse 70% 40% at 10% 0%, rgb(82 46 95 / 0.35), transparent 50%),
    #0b0818;
  color: #fff;
  animation: loja-page-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.loja-page__main {
  padding-bottom: 0;
}

.loja-page__body {
  padding-bottom: 1rem;
}

.loja-page__state {
  display: grid;
  place-items: center;
  gap: 0.75rem;
  min-height: 70dvh;
  padding: 6rem 1.5rem 3rem;
  text-align: center;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  color: rgb(255 255 255 / 0.7);
}

.loja-page__state h1 {
  margin: 0;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
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
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
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

.loja-final-cta {
  background:
    radial-gradient(ellipse 60% 80% at 50% 100%, rgb(201 162 39 / 0.16), transparent 60%),
    transparent;
}

.loja-final-cta__inner {
  display: grid;
  justify-items: start;
  gap: 0.35rem;
}

.loja-final-cta__text {
  margin: 0.35rem 0 1rem;
  max-width: 32rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.55;
  color: rgb(255 255 255 / 0.6);
}

.loja-final-cta__back {
  margin-top: 1rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.5);
  text-decoration: none;
}

.loja-final-cta__back:hover {
  color: #fff;
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
