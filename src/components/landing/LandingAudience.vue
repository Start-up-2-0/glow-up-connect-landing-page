<script setup lang="ts">
import { computed } from 'vue'
import {
  AUDIENCE_INTRO,
  AUDIENCE_PROFILES,
  LANDING_SECTIONS,
  type AudienceProfile,
} from '@/constants/landing'
import { FEATURE_FLAGS } from '@/config/features'
import { STORY_CHAPTERS } from '@/constants/showcaseCallouts'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { useLandingPlanosPref } from '@/composables/useLandingPlanosPref'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import LandingFeatureIcon from '@/components/landing/LandingFeatureIcon.vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'

const { goToSection } = useLandingScroll()
const { preferirTipo } = useLandingPlanosPref()
const { isVisible } = useRevealOnScroll()
const chapter = STORY_CHAPTERS.publico

const perfis = computed(() =>
  FEATURE_FLAGS.lojasHabilitadas
    ? AUDIENCE_PROFILES
    : AUDIENCE_PROFILES.filter((perfil) => perfil.tipoAssinatura === 'ProfissionalAutonomo'),
)

const oficios = computed(() =>
  FEATURE_FLAGS.lojasHabilitadas
    ? AUDIENCE_INTRO.oficios
    : AUDIENCE_INTRO.oficios.filter((oficio) => oficio !== 'Barbearias' && oficio !== 'Salões'),
)

const intro = computed(() =>
  FEATURE_FLAGS.lojasHabilitadas
    ? AUDIENCE_INTRO
    : {
        ...AUDIENCE_INTRO,
        titulo: 'Feito para quem atende',
        destaque: 'sozinho',
        subtitulo:
          'Atendemos barbeiros e cabeleireiros(as) autônomos — agenda, clientes e financeiro no celular.',
      },
)

function verPlanos(perfil: AudienceProfile) {
  preferirTipo(perfil.tipoAssinatura)
  void goToSection(LANDING_SECTIONS.planos)
}
</script>

<template>
  <LandingStorySection
    :id="LANDING_SECTIONS.publico"
    tone="dark"
    :chapter-index="chapter.index"
    :chapter-label="chapter.label"
    :show-progress="false"
  >
    <div class="px-4 pb-20 pt-4 lg:px-8 lg:pb-28 lg:pt-6">
      <div class="mx-auto max-w-[1280px]">
        <LandingSectionHeader
          :eyebrow="intro.eyebrow"
          :title="intro.titulo"
          :highlight="intro.destaque"
          :subtitle="intro.subtitulo"
        />

        <ul
          class="mt-6 flex flex-wrap items-center justify-center gap-2"
          aria-label="Ofícios atendidos"
        >
          <li
            v-for="oficio in oficios"
            :key="oficio"
            class="rounded-full border border-glow-gold/25 bg-glow-gold/10 px-3 py-1 font-satoshi text-[11px] font-semibold uppercase tracking-[0.12em] text-glow-gold"
          >
            {{ oficio }}
          </li>
        </ul>

        <div class="relative mt-12 sm:mt-14">
          <div
            class="pointer-events-none absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-transparent via-glow-gold/40 to-transparent lg:block"
            aria-hidden="true"
          />

          <div
            ref="revealRoot"
            class="landing-stagger relative grid gap-5 md:grid-cols-2"
            :class="[
              isVisible && 'is-visible',
              perfis.length > 1 ? 'lg:grid-cols-3' : 'lg:grid-cols-1 lg:max-w-xl lg:mx-auto',
            ]"
          >
            <article
              v-for="perfil in perfis"
              :key="perfil.id"
              class="flex flex-col rounded-3xl border border-glow-border-soft bg-glow-surface p-5 landing-glass-card transition duration-300 hover:-translate-y-1 hover:border-glow-gold/30 hover:bg-glow-hover-surface sm:p-6"
            >
              <div class="flex items-center justify-between gap-3">
                <span
                  class="landing-icon-pop inline-flex size-12 items-center justify-center rounded-2xl bg-glow-gold/15 font-montserrat text-sm font-black text-glow-gold"
                >
                  {{ perfil.step }}
                </span>
                <span
                  class="flex size-11 items-center justify-center rounded-xl bg-glow-gold/10 text-glow-gold"
                  aria-hidden="true"
                >
                  <LandingFeatureIcon :name="perfil.icon" />
                </span>
              </div>

              <p class="mt-5 font-satoshi text-[11px] font-semibold uppercase tracking-[0.18em] text-glow-gold">
                {{ perfil.porte }}
              </p>
              <h3 class="mt-2 font-montserrat text-xl font-semibold text-glow-text">
                {{ perfil.titulo }}
              </h3>
              <p class="mt-3 font-poppins text-sm font-light leading-relaxed text-glow-text-muted">
                {{ perfil.descricao }}
              </p>

              <ul class="mt-5 space-y-2">
                <li
                  v-for="ponto in perfil.pontos"
                  :key="ponto"
                  class="flex items-start gap-2 font-poppins text-sm font-light text-glow-text-subtle"
                >
                  <span
                    class="mt-1.5 size-1.5 shrink-0 rounded-full bg-glow-gold"
                    aria-hidden="true"
                  />
                  {{ ponto }}
                </li>
              </ul>

              <button
                type="button"
                class="mt-auto pt-6 text-left font-satoshi text-sm font-semibold text-glow-gold transition hover:text-glow-gold-cta"
                @click="verPlanos(perfil)"
              >
                {{ perfil.cta }} →
              </button>
            </article>
          </div>
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
