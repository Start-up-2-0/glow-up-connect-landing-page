import type { EstabelecimentoPublico } from '@/types/estabelecimento.types'

export interface CriarAgendamentoPublicoPayload {
  profissionalPublicGuid?: string
  servicoIds: number[]
  data: string
  horarioInicio: string
  inicioSelecionado?: string
  clienteNome: string
  clienteEmail: string
  clienteTelefone: string
  observacao?: string
}

export interface AgendamentoCriado {
  id: number
  status: string
  valorTotal: number
  duracaoTotalMinutos: number
  inicio: string
  fim: string
}

export interface AgendamentoContextoPublico {
  estabelecimento: EstabelecimentoPublico
  profissional: ProfissionalPublico
  podeReceberAgendamento: boolean
}

export interface CriarAgendamentoComCadastroPayload {
  profissionalPublicGuid?: string
  servicoIds: number[]
  data: string
  horarioInicio: string
  inicioSelecionado?: string
  observacao?: string
  cadastro: {
    nome: string
    email: string
    telefone: string
    senha: string
  }
}

export interface ServicoPublico {
  id: number
  nome: string
  descricao: string
  precoMinimo: number
  precoMaximo: number
  duracaoMinutosBase: number
  duracaoMinutosEstimada: number
  tipoServico: 'Individual' | 'Combo'
  imagem?: string | null
}

export interface ProfissionalPublico {
  publicGuid: string
  nomePublico: string
  /** Foto de apresentação do profissional. */
  foto?: string | null
}

export interface SlotDisponivel {
  profissionalId: number
  inicio: string
  fim: string
}

export interface DisponibilidadeAgenda {
  servicoId: number
  servicoIds: number[]
  duracaoMinutos: number
  mensagemIndisponibilidade: string | null
  datasAtendimento: string[]
  slots: SlotDisponivel[]
}

export interface ConsultarDisponibilidadeParams {
  dataInicio: string
  dataFim: string
  servicoIds: number[]
  profissionalId?: number
  profissionalPublicGuid?: string
}
