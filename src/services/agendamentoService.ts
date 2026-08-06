import api from './api'
import type { ApiSuccessResponse } from '@/types/api.types'
import type { AgendamentoCriado } from '@/types/agendamento.types'

export interface CriarAgendamentoLogadoPayload {
  estabelecimentoPublicGuid: string
  profissionalPublicGuid?: string
  servicoIds: number[]
  data: string
  horarioInicio: string
  inicioSelecionado?: string
  observacao?: string
}

export const agendamentoService = {
  criar(payload: CriarAgendamentoLogadoPayload) {
    return api
      .post<ApiSuccessResponse<AgendamentoCriado>>('/agendamentos', payload)
      .then((response) => response.data.data)
  },
}
