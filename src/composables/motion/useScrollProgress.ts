import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useMotionPrefs } from '@/composables/motion/useMotionPrefs'

/**
 * Progresso 0→1 enquanto o elemento atravessa a viewport.
 * Usa rAF + IntersectionObserver para ligar/desligar o listener.
 */
export function useScrollProgress(refKey = 'progressRoot') {
  const el = useTemplateRef<HTMLElement>(refKey)
  const progress = ref(0)
  const inView = ref(false)
  const { reduceMotion } = useMotionPrefs()

  let ticking = false
  let observing = false

  function measure() {
    const node = el.value
    if (!node || reduceMotion.value) {
      progress.value = reduceMotion.value ? 1 : progress.value
      return
    }

    const rect = node.getBoundingClientRect()
    const vh = window.innerHeight || 1
    const total = rect.height + vh
    const traveled = vh - rect.top
    progress.value = Math.min(1, Math.max(0, traveled / total))
  }

  function onScroll() {
    if (ticking || !observing) return
    ticking = true
    requestAnimationFrame(() => {
      measure()
      ticking = false
    })
  }

  function start() {
    if (observing || reduceMotion.value) return
    observing = true
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  }

  function stop() {
    if (!observing) return
    observing = false
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }

  let io: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof window === 'undefined') return

    if (reduceMotion.value) {
      progress.value = 1
      inView.value = true
      return
    }

    const node = el.value
    if (!node) return

    io = new IntersectionObserver(
      ([entry]) => {
        inView.value = Boolean(entry?.isIntersecting)
        if (entry?.isIntersecting) start()
        else stop()
      },
      { rootMargin: '20% 0px 20% 0px', threshold: 0 },
    )
    io.observe(node)
  })

  watch(el, (node) => {
    if (node && io) io.observe(node)
  })

  onBeforeUnmount(() => {
    stop()
    io?.disconnect()
  })

  const eased = computed(() => {
    const t = progress.value
    return t * t * (3 - 2 * t)
  })

  return { progress, eased, inView }
}
