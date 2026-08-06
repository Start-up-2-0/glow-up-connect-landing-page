import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, TOKEN_HEADER } from '@/constants/storageKeys'
import type { ApiErrorResponse } from '@/types/api.types'
import {
  acquireRequestProof,
  invalidateRequestProofPool,
  isExemptRequestProofPath,
  isRequestProofError,
  REQUEST_PROOF_HEADER,
} from '@/composables/useRequestProof'
import { authService } from '@/services/authService'
import {
  clearSessionStorage,
  getAccessToken,
  persistSession,
  setAccessToken,
} from '@/utils/session'

const PUBLIC_API_PATHS = ['/auth/login', '/auth/refresh', '/planos', '/publico/', '/security/']

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
})

function isPublicApiPath(url?: string): boolean {
  if (!url) return false
  return PUBLIC_API_PATHS.some((path) => url.includes(path))
}

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error)
    else if (token) promise.resolve(token)
  })
  failedQueue = []
}

async function refreshAccessToken(): Promise<string> {
  const { data } = await authService.refresh()
  const tokens = data.data
  persistSession({
    token: tokens.token,
    refreshToken: '',
    expiresAt: tokens.expiresAt,
    refreshExpiresAt: tokens.refreshExpiresAt,
  })
  setAccessToken(tokens.token)
  return tokens.token
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token && config.headers) {
    config.headers[TOKEN_HEADER] = token
  }

  if (!isExemptRequestProofPath(config.url)) {
    const proof = await acquireRequestProof(config.method, config.url)
    if (proof && config.headers) {
      config.headers[REQUEST_PROOF_HEADER] = proof
    }
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _proofRetry?: boolean
      _retry?: boolean
    }

    if (
      originalRequest &&
      error.response?.status === 403 &&
      isRequestProofError(error.response.data?.code) &&
      !originalRequest._proofRetry
    ) {
      originalRequest._proofRetry = true
      invalidateRequestProofPool()
      const proof = await acquireRequestProof(originalRequest.method, originalRequest.url)
      if (proof && originalRequest.headers) {
        originalRequest.headers[REQUEST_PROOF_HEADER] = proof
        return api(originalRequest)
      }
    }

    const status = error.response?.status
    const code = error.response?.data?.code
    const requestUrl = originalRequest?.url
    const shouldRefresh =
      originalRequest &&
      status === 401 &&
      (code === 'TOKEN_EXPIRED' || code === 'UNAUTHORIZED') &&
      !isPublicApiPath(requestUrl)

    if (!shouldRefresh) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      clearSessionStorage()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers[TOKEN_HEADER] = token
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const newToken = await refreshAccessToken()
      processQueue(null, newToken)
      originalRequest.headers[TOKEN_HEADER] = newToken
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearSessionStorage()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
