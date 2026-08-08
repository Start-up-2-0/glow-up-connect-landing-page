import api from './api'
import type { ApiSuccessResponse } from '@/types/api.types'
import type { PlanosResponse, TipoAssinatura } from '@/types/plano.types'

function unwrap<T>(response: { data: ApiSuccessResponse<T> }): T {
  return response.data.data
}

export const planoService = {
  listar(tipoAssinatura?: TipoAssinatura) {
    return api
      .get<ApiSuccessResponse<PlanosResponse>>('/planos', {
        params: tipoAssinatura ? { tipoAssinatura } : undefined,
      })
      .then(unwrap)
  },
}
