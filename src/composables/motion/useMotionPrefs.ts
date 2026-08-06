import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useMotionPrefs() {
  const reduceMotion = ref(false)
  const isCoarsePointer = ref(false)
  const isNarrow = ref(false)

  let mqReduce: MediaQueryList | null = null
  let mqCoarse: MediaQueryList | null = null
  let mqNarrow: MediaQueryList | null = null

  function sync() {
    reduceMotion.value = mqReduce?.matches ?? false
    isCoarsePointer.value = mqCoarse?.matches ?? false
    isNarrow.value = mqNarrow?.matches ?? false
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    mqCoarse = window.matchMedia('(pointer: coarse)')
    mqNarrow = window.matchMedia('(max-width: 767px)')
    sync()
    mqReduce.addEventListener('change', sync)
    mqCoarse.addEventListener('change', sync)
    mqNarrow.addEventListener('change', sync)
  })

  onBeforeUnmount(() => {
    mqReduce?.removeEventListener('change', sync)
    mqCoarse?.removeEventListener('change', sync)
    mqNarrow?.removeEventListener('change', sync)
  })

  return {
    reduceMotion,
    isCoarsePointer,
    isNarrow,
    /** Desktop fino: experiência cinematográfica completa */
    get cinematic() {
      return !reduceMotion.value && !isNarrow.value
    },
  }
}
