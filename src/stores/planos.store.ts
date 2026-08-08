import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { planoService } from '@/services/planoService'
import type { Plano, PromocaoLancamento, TipoAssinatura } from '@/types/plano.types'

const CACHE_TTL_MS = 5 * 60 * 1000

export const usePlanosStore = defineStore('planos', () => {
  const planos = ref<Plano[]>([])
  const promocao = ref<PromocaoLancamento | null>(null)
  const carregadoEm = ref<number | null>(null)
  const tipoAssinaturaCarregado = ref<TipoAssinatura | null>(null)
  const loading = ref(false)

  const promocaoDisponivel = computed(() => promocao.value?.disponivel === true)

  const isCacheValid = computed(() => {
    if (!carregadoEm.value || planos.value.length === 0) return false
    return Date.now() - carregadoEm.value < CACHE_TTL_MS
  })

  async function fetchPlanos(
    force = false,
    tipoAssinatura: TipoAssinatura = 'Estabelecimento',
  ) {
    if (
      !force
      && isCacheValid.value
      && tipoAssinaturaCarregado.value === tipoAssinatura
    ) {
      return { planos: planos.value, promocao: promocao.value }
    }

    loading.value = true
    try {
      const data = await planoService.listar(tipoAssinatura)
      planos.value = data.planos
      promocao.value = data.promocaoLancamento
      carregadoEm.value = Date.now()
      tipoAssinaturaCarregado.value = tipoAssinatura
      return { planos: planos.value, promocao: promocao.value }
    } finally {
      loading.value = false
    }
  }

  return {
    planos,
    promocao,
    loading,
    tipoAssinaturaCarregado,
    promocaoDisponivel,
    fetchPlanos,
  }
})
