import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Parallax leve só no fundo e no visual.
 * Sem fade/translate no copy (evita fantasmas sob a navbar).
 */
export function useHeroParallax() {
  const scrollY = ref(0)
  const mouseX = ref(0)
  const mouseY = ref(0)
  const reduceMotion = ref(false)
  const enabled = ref(false)

  let ticking = false
  let heroEl: HTMLElement | null = null

  function measure() {
    scrollY.value = window.scrollY
  }

  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      measure()
      ticking = false
    })
  }

  function onMouseMove(event: MouseEvent) {
    if (!heroEl || !enabled.value || reduceMotion.value) return
    const rect = heroEl.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    // Só tilt enquanto o hero ainda está na viewport
    if (rect.bottom < 80) return
    const nx = (event.clientX - rect.left) / rect.width - 0.5
    const ny = (event.clientY - rect.top) / rect.height - 0.5
    mouseX.value = Math.max(-0.5, Math.min(0.5, nx))
    mouseY.value = Math.max(-0.5, Math.min(0.5, ny))
  }

  function onMouseLeave() {
    mouseX.value = 0
    mouseY.value = 0
  }

  const y = computed(() => Math.min(Math.max(scrollY.value, 0), 280))

  const layerBg = computed(() => {
    if (!enabled.value || reduceMotion.value) return undefined
    return { transform: `translate3d(0, ${y.value * 0.12}px, 0)` }
  })

  const layerCopy = computed(() => undefined)

  const layerVisual = computed(() => {
    if (!enabled.value || reduceMotion.value) return undefined
    return {
      transform: `translate3d(${mouseX.value * 10}px, ${y.value * -0.04 + mouseY.value * 6}px, 0)`,
    }
  })

  const layerCardPrimary = computed(() => {
    if (!enabled.value || reduceMotion.value) return undefined
    return {
      transform: `translate3d(${mouseX.value * -6}px, ${mouseY.value * -4}px, 0)`,
    }
  })

  const layerCardSecondary = computed(() => {
    if (!enabled.value || reduceMotion.value) return undefined
    return {
      transform: `translate3d(${mouseX.value * 8}px, ${mouseY.value * 4}px, 0)`,
    }
  })

  function bind(el: HTMLElement | null) {
    heroEl = el
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    enabled.value = !reduceMotion.value
    if (!enabled.value) return
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return {
    bind,
    onMouseMove,
    onMouseLeave,
    layerBg,
    layerCopy,
    layerVisual,
    layerCardPrimary,
    layerCardSecondary,
  }
}
