import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

export function useRevealOnScroll(
  refKey = 'revealRoot',
  /** Dispara cedo — evita “buraco” vazio ao entrar na seção */
  rootMargin = '0px 0px 18% 0px',
) {
  const el = useTemplateRef<HTMLElement>(refKey)
  const isVisible = ref(false)

  let observer: IntersectionObserver | null = null

  function observe(node: HTMLElement) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isVisible.value = true
      return
    }

    observer?.disconnect()
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          isVisible.value = true
          observer?.disconnect()
        }
      },
      { rootMargin, threshold: 0.01 },
    )
    observer.observe(node)
  }

  onMounted(() => {
    if (typeof window === 'undefined') {
      isVisible.value = true
      return
    }

    if (el.value) observe(el.value)
  })

  watch(el, (node) => {
    if (node && !isVisible.value) observe(node)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { isVisible }
}
