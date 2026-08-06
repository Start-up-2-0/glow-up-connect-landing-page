export interface ApiSuccessResponse<T> {
  success: true
  message: string
  data: T
}

export interface ApiSuccessResponseVoid {
  success: true
  message: string
}

export interface ApiErrorResponse {
  success: false
  message: string
  code: string
  details?: unknown
}

export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as ApiErrorResponse).success === false &&
    'code' in data
  )
}
