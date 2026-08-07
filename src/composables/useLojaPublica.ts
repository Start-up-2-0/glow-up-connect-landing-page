import { computed, ref, watch, type MaybeRefOrGetter, toValue } from 'vue'
import { useApiError } from '@/composables/useApiError'
import { publicoService } from '@/services/publicoService'
import type { ServicoPublico } from '@/types/agendamento.types'
import type {
  AvaliacoesPaginadas,
  ProfissionalVitrinePublico,
} from '@/types/avaliacao.types'
import type { EstabelecimentoPublico } from '@/types/estabelecimento.types'
import { useGeolocation } from '@/composables/useGeolocation'

function mapBasicoParaVitrine(
  p: { publicGuid: string; nomePublico: string; foto?: string | null },
): ProfissionalVitrinePublico {
  return {
    publicGuid: p.publicGuid,
    nomePublico: p.nomePublico,
    biografia: '',
    logo: p.foto ?? '',
    notaMedia: null,
    totalAvaliacoes: 0,
  }
}

/** Une vitrine (bio/notas) com lista agendável — a vitrine exige SomenteExibicao e pode vir vazia. */
function mesclarProfissionais(
  vitrine: ProfissionalVitrinePublico[],
  agendaveis: ProfissionalVitrinePublico[],
): ProfissionalVitrinePublico[] {
  const byGuid = new Map<string, ProfissionalVitrinePublico>()

  for (const p of agendaveis) {
    byGuid.set(p.publicGuid, { ...p })
  }

  for (const p of vitrine) {
    const existente = byGuid.get(p.publicGuid)
    if (existente) {
      byGuid.set(p.publicGuid, {
        ...existente,
        biografia: p.biografia || existente.biografia,
        logo: p.logo || existente.logo,
        notaMedia: p.notaMedia ?? existente.notaMedia,
        totalAvaliacoes: p.totalAvaliacoes || existente.totalAvaliacoes,
      })
    } else {
      byGuid.set(p.publicGuid, { ...p })
    }
  }

  return Array.from(byGuid.values()).sort((a, b) =>
    a.nomePublico.localeCompare(b.nomePublico, 'pt-BR'),
  )
}

export function useLojaPublica(publicGuidSource: MaybeRefOrGetter<string>) {
  const { resolveError } = useApiError()
  const { coords, request: requestGeo } = useGeolocation()

  const loja = ref<EstabelecimentoPublico | null>(null)
  const servicos = ref<ServicoPublico[]>([])
  const profissionais = ref<ProfissionalVitrinePublico[]>([])
  const avaliacoes = ref<AvaliacoesPaginadas | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const publicGuid = computed(() => toValue(publicGuidSource).trim())

  const enderecoCompleto = computed(() => {
    const e = loja.value?.endereco
    if (!e) return null
    return [e.logradouro, e.bairro, e.cidade, e.estado].filter(Boolean).join(' · ')
  })

  const mapsUrl = computed(() => {
    const e = loja.value?.endereco
    if (!e) return null
    const q = encodeURIComponent(
      [e.logradouro, e.bairro, e.cidade, e.estado, 'Brasil'].filter(Boolean).join(', '),
    )
    return `https://www.google.com/maps/search/?api=1&query=${q}`
  })

  async function carregar() {
    const guid = publicGuid.value
    if (!guid) {
      loja.value = null
      error.value = 'Estabelecimento não encontrado.'
      return
    }

    loading.value = true
    error.value = null

    try {
      if (!coords.value) {
        try {
          await requestGeo()
        } catch {
          // geo opcional
        }
      }

      const params =
        coords.value != null
          ? { latitude: coords.value.latitude, longitude: coords.value.longitude }
          : undefined

      const [detalhe, svcs, vitrine, agendaveis, avs] = await Promise.all([
        publicoService.obterEstabelecimento(guid, params),
        publicoService.listarServicosLoja(guid).catch(() => [] as ServicoPublico[]),
        publicoService.listarProfissionaisVitrine(guid).catch(() => [] as ProfissionalVitrinePublico[]),
        publicoService
          .listarProfissionaisLoja(guid)
          .catch(() => [])
          .then((lista) => lista.map(mapBasicoParaVitrine)),
        publicoService
          .listarAvaliacoesEstabelecimento(guid, { pagina: 1, tamanhoPagina: 8 })
          .catch(() => null),
      ])

      loja.value = detalhe
      servicos.value = svcs
      profissionais.value = mesclarProfissionais(vitrine, agendaveis)
      avaliacoes.value = avs
    } catch (err) {
      loja.value = null
      servicos.value = []
      profissionais.value = []
      avaliacoes.value = null
      error.value = resolveError(err, 'Não foi possível carregar esta loja.')
    } finally {
      loading.value = false
    }
  }

  watch(publicGuid, () => {
    void carregar()
  }, { immediate: true })

  return {
    loja,
    servicos,
    profissionais,
    avaliacoes,
    loading,
    error,
    enderecoCompleto,
    mapsUrl,
    recarregar: carregar,
  }
}
