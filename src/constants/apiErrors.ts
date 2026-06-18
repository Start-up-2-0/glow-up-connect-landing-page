export const DEFAULT_ERROR_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente.'

export function getApiErrorMessage(_code?: string, fallback?: string): string {
  return fallback ?? DEFAULT_ERROR_MESSAGE
}
