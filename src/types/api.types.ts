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

export interface ValidationProblemDetails {
  type?: string
  title?: string
  status: number
  errors?: Record<string, string[]>
}

export function isValidationProblemDetails(data: unknown): data is ValidationProblemDetails {
  return (
    typeof data === 'object' &&
    data !== null &&
    'errors' in data &&
    typeof (data as ValidationProblemDetails).errors === 'object'
  )
}
