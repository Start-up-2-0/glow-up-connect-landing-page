import type { AxiosError } from 'axios'
import { isApiErrorResponse, type ApiErrorResponse } from '@/types/api.types'
import { DEFAULT_ERROR_MESSAGE, getApiErrorMessage } from '@/constants/apiErrors'

export function useApiError() {
  function resolveError(error: unknown, fallback = DEFAULT_ERROR_MESSAGE): string {
    if (!error || typeof error !== 'object') return fallback

    const axiosError = error as AxiosError<ApiErrorResponse>
    const data = axiosError.response?.data

    if (isApiErrorResponse(data)) {
      return getApiErrorMessage(data.code, data.message || fallback)
    }

    if (data && typeof data === 'object' && 'message' in data) {
      const message = (data as { message?: string }).message
      if (message) return message
    }

    if (axiosError.message) return axiosError.message

    return fallback
  }

  return { resolveError }
}
