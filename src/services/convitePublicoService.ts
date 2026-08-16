import api from './api'
import type { ApiSuccessResponse } from '@/types/api.types'
import type {
  AceitarConviteCadastroPayload,
  ConviteAceito,
  ConvitePreview,
} from '@/types/convite.types'

function unwrap<T>(response: { data: ApiSuccessResponse<T> }): T {
  return response.data.data
}

export const convitePublicoService = {
  obterPreview(token: string) {
    return api
      .get<ApiSuccessResponse<ConvitePreview>>(
        `/publico/convites/${encodeURIComponent(token)}/preview`,
      )
      .then(unwrap)
  },

  aceitar(token: string) {
    return api
      .post<ApiSuccessResponse<ConviteAceito>>(
        `/publico/convites/${encodeURIComponent(token)}/aceitar`,
      )
      .then(unwrap)
  },

  aceitarComCadastro(token: string, payload: AceitarConviteCadastroPayload) {
    return api
      .post<ApiSuccessResponse<ConviteAceito>>(
        `/publico/convites/${encodeURIComponent(token)}/aceitar-com-cadastro`,
        payload,
      )
      .then(unwrap)
  },
}
