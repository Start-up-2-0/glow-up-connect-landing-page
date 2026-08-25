<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { EstabelecimentoPublico } from '@/types/estabelecimento.types'
import { lojaPublicaPath } from '@/constants/routes'

const props = withDefaults(defineProps<{
  loja: EstabelecimentoPublico
  embedded?: boolean
}>(), {
  embedded: false,
})

const endereco = computed(() => {
  const item = props.loja.endereco
  if (!item) return null
  return [item.logradouro, item.bairro, item.cidade, item.estado].filter(Boolean).join(' · ')
})

const comodidades = computed(() =>
  [...(props.loja.comodidades ?? [])].sort((a, b) => a.ordem - b.ordem),
)
</script>

<template>
  <section
    class="agendar-loja"
    :class="{ 'agendar-loja--embedded': embedded }"
    aria-labelledby="agendar-loja-nome"
  >
    <div class="agendar-loja__glow" aria-hidden="true" />

    <div class="agendar-loja__content">
      <div class="agendar-loja__identity">
        <div class="agendar-loja__logo">
          <img
            v-if="loja.logo"
            :src="loja.logo"
            :alt="`Logo de ${loja.nome}`"
            class="size-full object-contain p-2.5"
            width="96"
            height="96"
          />
          <span v-else aria-hidden="true">{{ loja.nome.charAt(0) }}</span>
        </div>

        <div class="min-w-0 flex-1">
          <p v-if="loja.categoria" class="agendar-loja__eyebrow">{{ loja.categoria }}</p>
          <h1 id="agendar-loja-nome" class="agendar-loja__name">{{ loja.nome }}</h1>

          <div class="agendar-loja__meta">
            <span v-if="(loja.notaMedia ?? 0) > 0" class="agendar-loja__badge">
              <span class="text-glow-gold" aria-hidden="true">★</span>
              {{ loja.notaMedia!.toFixed(1).replace('.', ',') }}
              <span class="font-normal text-glow-text-muted">({{ loja.totalAvaliacoes ?? 0 }})</span>
            </span>
            <span
              v-if="loja.abertoAgora != null"
              class="agendar-loja__badge"
              :class="loja.abertoAgora && 'agendar-loja__badge--open'"
            >
              {{ loja.abertoAgora ? 'Aberto agora' : 'Fechado agora' }}
              <template v-if="loja.horarioAbertura && loja.horarioFechamento">
                · {{ loja.horarioAbertura }}–{{ loja.horarioFechamento }}
              </template>
            </span>
          </div>
        </div>
      </div>

      <div class="agendar-loja__details">
        <p v-if="endereco" class="agendar-loja__address">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 18s5-4.9 5-10a5 5 0 1 0-10 0c0 5.1 5 10 5 10Z" stroke="currentColor" stroke-width="1.4" />
            <circle cx="10" cy="8" r="1.7" stroke="currentColor" stroke-width="1.4" />
          </svg>
          <span>{{ endereco }}</span>
        </p>

        <p v-if="loja.descricao" class="agendar-loja__description">
          {{ loja.descricao }}
        </p>

        <div v-if="comodidades.length" class="agendar-loja__amenities">
          <p>Comodidades</p>
          <ul>
            <li v-for="comodidade in comodidades" :key="comodidade.id">
              <span aria-hidden="true">✓</span>{{ comodidade.nome }}
            </li>
          </ul>
        </div>

        <RouterLink :to="lojaPublicaPath(loja.publicGuid)" class="agendar-loja__profile-link">
          Ver perfil completo da loja
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </div>

    <div class="agendar-loja__action-copy">
      <span>Agendamento online</span>
      <strong>Escolha abaixo o melhor serviço e horário para você.</strong>
    </div>
  </section>
</template>

<style scoped>
.agendar-loja {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: min(100% - 2rem, 1120px);
  margin: 0 auto 2rem;
  border: 1px solid color-mix(in srgb, var(--glow-gold-cta) 24%, var(--glow-border-soft));
  border-radius: 1.75rem;
  background: color-mix(in srgb, var(--glow-surface) 94%, transparent);
  box-shadow: 0 28px 80px -52px rgba(0, 0, 0, 0.9);
}

.agendar-loja__glow {
  position: absolute;
  z-index: -1;
  width: 25rem;
  height: 25rem;
  right: -10rem;
  top: -14rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--glow-gold-cta) 22%, transparent);
  filter: blur(90px);
}

.agendar-loja__content { padding: 1.25rem; }
.agendar-loja__identity { display: flex; align-items: center; gap: 1rem; }
.agendar-loja__logo {
  display: grid; place-items: center; flex: 0 0 auto; width: 5.5rem; height: 5.5rem;
  overflow: hidden; border: 1px solid var(--glow-border-soft); border-radius: 1.25rem;
  background: var(--glow-avatar-bg); color: var(--glow-gold); font: 800 2rem Montserrat, sans-serif;
}
.agendar-loja__eyebrow { margin: 0; color: var(--glow-gold); font: 700 .7rem Satoshi, sans-serif; letter-spacing: .18em; text-transform: uppercase; }
.agendar-loja__name { margin: .25rem 0 0; color: var(--glow-text); font: 800 clamp(1.45rem, 5vw, 2.2rem) Montserrat, sans-serif; line-height: 1.12; }
.agendar-loja__meta { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: .65rem; }
.agendar-loja__badge { display: inline-flex; align-items: center; gap: .25rem; border: 1px solid var(--glow-border-soft); border-radius: 9999px; padding: .3rem .65rem; color: var(--glow-text-muted); font: 600 .72rem Satoshi, sans-serif; }
.agendar-loja__badge--open { border-color: color-mix(in srgb, var(--glow-success) 38%, transparent); color: var(--glow-success); }
.agendar-loja__details { margin-top: 1.1rem; padding-top: 1rem; border-top: 1px solid var(--glow-border-soft); }
.agendar-loja__address { display: flex; align-items: flex-start; gap: .55rem; margin: 0; color: var(--glow-text-soft); font: 500 .88rem Poppins, sans-serif; }
.agendar-loja__address svg { width: 1.05rem; flex: 0 0 auto; margin-top: .12rem; color: var(--glow-gold); }
.agendar-loja__description { max-width: 52rem; margin: .8rem 0 0; color: var(--glow-text-muted); font: 300 .88rem/1.65 Poppins, sans-serif; }
.agendar-loja__amenities { margin-top: 1rem; }
.agendar-loja__amenities > p { margin: 0 0 .55rem; color: var(--glow-text); font: 700 .78rem Satoshi, sans-serif; }
.agendar-loja__amenities ul { display: flex; flex-wrap: wrap; gap: .45rem; margin: 0; padding: 0; list-style: none; }
.agendar-loja__amenities li { display: inline-flex; align-items: center; gap: .35rem; border-radius: 9999px; background: var(--glow-bg-elevated); padding: .4rem .7rem; color: var(--glow-text-soft); font: 600 .75rem Satoshi, sans-serif; }
.agendar-loja__amenities li span { color: var(--glow-gold); }
.agendar-loja__profile-link { display: inline-flex; align-items: center; gap: .45rem; margin-top: 1rem; color: var(--glow-gold); font: 700 .8rem Satoshi, sans-serif; text-decoration: none; }
.agendar-loja__profile-link:hover { text-decoration: underline; }
.agendar-loja__action-copy { display: flex; flex-direction: column; gap: .2rem; border-top: 1px solid var(--glow-border-soft); background: color-mix(in srgb, var(--glow-bg-elevated) 82%, transparent); padding: .9rem 1.25rem; }
.agendar-loja__action-copy span { color: var(--glow-gold); font: 700 .68rem Satoshi, sans-serif; letter-spacing: .16em; text-transform: uppercase; }
.agendar-loja__action-copy strong { color: var(--glow-text-soft); font: 600 .84rem Satoshi, sans-serif; }

.agendar-loja--embedded {
  width: 100%;
  margin: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.agendar-loja--embedded .agendar-loja__content { padding: 1.25rem; }
.agendar-loja--embedded .agendar-loja__logo { width: 4.25rem; height: 4.25rem; border-radius: 1rem; }
.agendar-loja--embedded .agendar-loja__name { font-size: clamp(1.25rem, 4vw, 1.75rem); }
.agendar-loja--embedded .agendar-loja__action-copy { padding-block: .7rem; }

@media (min-width: 760px) {
  .agendar-loja__content { display: grid; grid-template-columns: minmax(18rem, .8fr) minmax(22rem, 1.2fr); gap: 2rem; padding: 1.75rem; }
  .agendar-loja__details { margin: 0; padding: 0 0 0 2rem; border-top: 0; border-left: 1px solid var(--glow-border-soft); }
  .agendar-loja__action-copy { flex-direction: row; align-items: center; justify-content: space-between; padding-inline: 1.75rem; }
  .agendar-loja--embedded .agendar-loja__content { grid-template-columns: minmax(15rem, .85fr) minmax(20rem, 1.15fr); gap: 1.5rem; padding: 1.25rem 1.5rem; }
  .agendar-loja--embedded .agendar-loja__details { padding-left: 1.5rem; }
}

@media (max-width: 480px) {
  .agendar-loja { width: min(100% - 1rem, 1120px); border-radius: 1.25rem; }
  .agendar-loja__logo { width: 4.5rem; height: 4.5rem; border-radius: 1rem; }
  .agendar-loja--embedded { width: 100%; border-radius: 0; }
  .agendar-loja--embedded .agendar-loja__content { padding: 1rem; }
  .agendar-loja--embedded .agendar-loja__identity { gap: .75rem; }
  .agendar-loja--embedded .agendar-loja__logo { width: 3.5rem; height: 3.5rem; border-radius: .8rem; }
  .agendar-loja--embedded .agendar-loja__eyebrow { font-size: .6rem; }
  .agendar-loja--embedded .agendar-loja__name { margin-top: .1rem; font-size: 1.2rem; }
  .agendar-loja--embedded .agendar-loja__meta { margin-top: .4rem; }
  .agendar-loja--embedded .agendar-loja__badge { padding: .22rem .5rem; font-size: .65rem; }
  .agendar-loja--embedded .agendar-loja__details { margin-top: .75rem; padding-top: .75rem; }
  .agendar-loja--embedded .agendar-loja__address { font-size: .75rem; line-height: 1.45; }
  .agendar-loja--embedded .agendar-loja__description { display: none; }
  .agendar-loja--embedded .agendar-loja__amenities { margin-top: .7rem; overflow: hidden; }
  .agendar-loja--embedded .agendar-loja__amenities > p { display: none; }
  .agendar-loja--embedded .agendar-loja__amenities ul { flex-wrap: nowrap; overflow-x: auto; padding-bottom: .2rem; scrollbar-width: none; }
  .agendar-loja--embedded .agendar-loja__amenities ul::-webkit-scrollbar { display: none; }
  .agendar-loja--embedded .agendar-loja__amenities li { flex: 0 0 auto; padding: .3rem .55rem; font-size: .68rem; }
  .agendar-loja--embedded .agendar-loja__profile-link { margin-top: .65rem; font-size: .72rem; }
  .agendar-loja--embedded .agendar-loja__action-copy { display: none; }
}
</style>
