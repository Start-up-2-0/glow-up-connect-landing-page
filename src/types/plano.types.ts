export interface Plano {
  id: number
  nome: string
  descricao: string
  preco: number
  periodo: string
  limiteProfissionais: number | null
  limiteServicos: number | null
  limiteAgendamentos: number | null
  limiteUsuarios: number | null
  limiteAgendamentosPorDia: number | null
  limiteEstabelecimentos: number | null
  prioridadeListagemPublica: boolean
  modulos: string[]
  funcionalidades: string[]
}

export interface PromocaoLancamento {
  disponivel: boolean
  vagasRestantes: number
  diasTrial: number
  percentualDescontoMensalidade: number
  diasVencimentoPermitidos: number[]
  diasAntecedenciaAlertaFatura: number
  diasAntecedenciaGeracaoCobranca: number
}

export interface PlanosResponse {
  planos: Plano[]
  promocaoLancamento: PromocaoLancamento
}
