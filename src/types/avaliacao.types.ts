export interface AvaliacaoDistribuicaoItem {
  nota: number
  quantidade: number
}

export interface AvaliacaoResumoPublico {
  notaMedia: number
  totalAvaliacoes: number
  janelaDias: number
  distribuicao: AvaliacaoDistribuicaoItem[]
}

export interface AvaliacaoComentarioItem {
  nota: number
  comentario: string | null
  avaliadoEm: string
  clienteNome: string
}

export interface AvaliacoesPaginadas {
  resumo: AvaliacaoResumoPublico
  total: number
  pagina: number
  tamanhoPagina: number
  itens: AvaliacaoComentarioItem[]
}

export interface ProfissionalVitrinePublico {
  publicGuid: string
  nomePublico: string
  biografia: string
  logo: string
  notaMedia?: number | null
  totalAvaliacoes?: number
}
