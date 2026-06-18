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

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
})

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
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

    return Promise.reject(error)
  },
)

export default api
