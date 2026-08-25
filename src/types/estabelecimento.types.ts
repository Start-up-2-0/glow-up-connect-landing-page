export interface EnderecoResumo {
  logradouro: string
  bairro: string
  cidade: string
  estado: string
}

/** Catálogo de categorias do marketplace, separado por tipo de operação. */
export interface EstabelecimentoCategoria {
  id: number
  nome: string
  slug?: string
  tipoAssinatura?: 'Estabelecimento' | 'ProfissionalAutonomo'
}

export interface EstabelecimentoProximo {
  publicGuid: string
  nome: string
  logo: string
  descricao: string
  distanciaKm: number
  endereco: EnderecoResumo
  destaqueMarketplace?: boolean
  notaMedia?: number
  totalAvaliacoes?: number
  categoriaId?: number
  categoria?: string
  /** Coordenadas do estabelecimento para o mapa (quando geocodificado). */
  latitude?: number | null
  longitude?: number | null
  /** Formato comercial: loja vs profissional autônomo. */
  tipoAssinatura?: 'Estabelecimento' | 'ProfissionalAutonomo' | null
}

export interface EstabelecimentosProximosResponse {
  cidade: string
  estado: string
  raioKm: number
  total: number
  itens: EstabelecimentoProximo[]
}

export interface EstabelecimentoPublico {
  publicGuid: string
  nome: string
  logo: string
  descricao: string
  endereco: EnderecoResumo | null
  distanciaKm: number | null
  notaMedia?: number
  totalAvaliacoes?: number
  abertoAgora?: boolean
  horarioAbertura?: string
  horarioFechamento?: string
  categoriaId?: number
  categoria?: string
  tipoAssinatura?: 'Estabelecimento' | 'ProfissionalAutonomo' | null
  comodidades?: ComodidadePublica[]
}

export interface ComodidadePublica {
  id: number
  nome: string
  slug: string
  icone: string
  ordem: number
}

export interface ListarProximosParams {
  latitude: number
  longitude: number
  raioKm?: number
  pagina?: number
  tamanhoPagina?: number
  /** Filtro por categoria de estabelecimento. */
  categoriaId?: number
}

export interface ObterEstabelecimentoParams {
  latitude?: number
  longitude?: number
}
