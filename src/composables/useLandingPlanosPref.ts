import { ref } from 'vue'
import type { TipoAssinatura } from '@/types/plano.types'

const tipoPreferido = ref<TipoAssinatura | null>(null)

export function useLandingPlanosPref() {
  function preferirTipo(tipo: TipoAssinatura) {
    tipoPreferido.value = tipo
  }

  return { tipoPreferido, preferirTipo }
}
