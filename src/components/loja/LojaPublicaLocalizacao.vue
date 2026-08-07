<script setup lang="ts">
import { computed } from 'vue'
import LandingCtaButton from '@/components/landing/LandingCtaButton.vue'
import LandingSectionHeader from '@/components/landing/LandingSectionHeader.vue'
import LandingStorySection from '@/components/landing/motion/LandingStorySection.vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import type { EnderecoResumo } from '@/types/estabelecimento.types'

const props = defineProps<{
  endereco: EnderecoResumo | null
  mapsUrl: string | null
  enderecoCompleto: string | null
}>()

const { isVisible } = useRevealOnScroll()

const embedUrl = computed(() => {
  if (!props.endereco) return null
  const q = encodeURIComponent(
    [
      props.endereco.logradouro,
      props.endereco.bairro,
      props.endereco.cidade,
      props.endereco.estado,
      'Brasil',
    ]
      .filter(Boolean)
      .join(', '),
  )
  return `https://maps.google.com/maps?q=${q}&z=15&output=embed`
})
</script>

<template>
  <LandingStorySection
    chapter-index="06"
    chapter-label="Local"
    :show-progress="false"
  >
    <div class="px-4 pb-16 pt-4 lg:px-8 lg:pb-24 lg:pt-6">
      <div
        ref="revealRoot"
        class="landing-reveal mx-auto grid max-w-[1280px] items-stretch gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
        :class="isVisible && 'is-visible'"
      >
        <div class="flex flex-col justify-center">
          <LandingSectionHeader
            align="left"
            eyebrow="Localização"
            title="Como"
            highlight="chegar"
            subtitle="Endereço completo e atalho para abrir rotas no mapa — planeje a visita com tranquilidade."
          />

          <p
            v-if="enderecoCompleto"
            class="mt-8 font-poppins text-base font-light leading-relaxed text-white/70 sm:text-lg"
          >
            {{ enderecoCompleto }}
          </p>
          <p
            v-else
            class="mt-8 font-poppins text-base font-light text-white/45"
          >
            Endereço não informado publicamente.
          </p>

          <div v-if="mapsUrl" class="mt-8">
            <LandingCtaButton
              label="Abrir rotas no mapa"
              variant="outline"
              size="sm"
              :href="mapsUrl"
            />
          </div>
        </div>

        <div
          v-if="embedUrl"
          class="min-h-[18rem] overflow-hidden rounded-[2rem] border border-white/15 bg-[#0d0820] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] landing-glass-card"
        >
          <iframe
            :src="embedUrl"
            title="Mapa da localização da loja"
            class="block size-full min-h-[18rem] border-0 grayscale-[0.2] contrast-[1.05] lg:min-h-[22rem]"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          />
        </div>
      </div>
    </div>
  </LandingStorySection>
</template>
