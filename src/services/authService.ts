import api from './api'
import type { ApiSuccessResponse, ApiSuccessResponseVoid } from '@/types/api.types'
import type {
  AuthTokens,
  CodigoAgendamentoPayload,
  LoginData,
  LoginPayload,
} from '@/types/auth.types'

export const authService = {
  login(payload: LoginPayload) {
    return api.post<ApiSuccessResponse<LoginData>>('/auth/login', payload)
  },

  autenticarPorCodigo(payload: CodigoAgendamentoPayload) {
    return api.post<ApiSuccessResponse<LoginData>>('/publico/agendar/auth/codigo', payload)
  },

  refresh() {
    return api.post<ApiSuccessResponse<AuthTokens>>('/auth/refresh', {}, { withCredentials: true })
  },

  logout() {
    return api.post<ApiSuccessResponseVoid>('/auth/logout')
  },
}
