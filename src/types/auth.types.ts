import type { ApiSuccessResponse } from './api.types'

export interface LoginPayload {
  email: string
  senha: string
  captchaToken?: string
}

export interface CodigoAgendamentoPayload {
  codigo: string
}

export interface AuthTokens {
  token: string
  refreshToken: string
  expiresAt: string
  refreshExpiresAt: string
}

export interface UserSummary {
  id: number
  nome: string
  email: string
  role: string
  avatarBase64?: string | null
}

export interface LoginData extends AuthTokens {
  usuario: UserSummary
  requerConfirmacaoEmail?: boolean
  sessaoAgendamentoPublico?: boolean
}

export type StoredSession = AuthTokens & {
  sessaoAgendamentoPublico?: boolean
}

export type LoginResponse = ApiSuccessResponse<LoginData>
