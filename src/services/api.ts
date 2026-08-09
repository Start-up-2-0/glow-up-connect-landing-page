import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/constants/storageKeys'
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
  persistSession,
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
  resolve: () => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown) {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error)
    else promise.resolve()
  })
  failedQueue = []
}

async function refreshAccessToken(): Promise<void> {
  const { data } = await authService.refresh()
  const tokens = data.data
  persistSession({
    token: '',
    refreshToken: '',
    expiresAt: tokens.expiresAt,
    refreshExpiresAt: tokens.refreshExpiresAt,
  })
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Auth via cookie HttpOnly (guc_access); não injeta token no header.

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
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(() => api(originalRequest))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      await refreshAccessToken()
      processQueue(null)
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)
      clearSessionStorage()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
