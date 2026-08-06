export interface EnderecoResumo {
  logradouro: string
  bairro: string
  cidade: string
  estado: string
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
}

export interface ObterEstabelecimentoParams {
  latitude?: number
  longitude?: number
}
