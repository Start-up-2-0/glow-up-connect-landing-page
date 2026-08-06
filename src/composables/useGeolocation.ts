import { onScopeDispose, ref } from 'vue'

export type GeolocationErrorCode = 'unsupported' | 'denied' | 'unavailable' | 'timeout' | 'unknown'

export interface GeolocationCoords {
  latitude: number
  longitude: number
  accuracy?: number | null
}

const ERROR_MESSAGES: Record<GeolocationErrorCode, string> = {
  unsupported: 'Seu navegador não suporta geolocalização.',
  denied: 'Permissão de localização negada. Usamos uma região padrão para você explorar.',
  unavailable: 'Não foi possível obter sua localização. Usamos uma região padrão.',
  timeout: 'A busca pela localização demorou demais. Usamos uma região padrão.',
  unknown: 'Erro ao obter localização. Usamos uma região padrão.',
}

/**
 * Geolocalização enxuta para a landing (uma leitura + fallback).
 * Sem watch contínuo — suficiente para centralizar o mapa de exploração.
 */
export function useGeolocation() {
  const coords = ref<GeolocationCoords | null>(null)
  const loading = ref(false)
  const errorCode = ref<GeolocationErrorCode | null>(null)
  const errorMessage = ref<string | null>(null)
  let disposed = false

  onScopeDispose(() => {
    disposed = true
  })

  function mapError(error: GeolocationPositionError): GeolocationErrorCode {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'denied'
      case error.POSITION_UNAVAILABLE:
        return 'unavailable'
      case error.TIMEOUT:
        return 'timeout'
      default:
        return 'unknown'
    }
  }

  async function request(options?: PositionOptions): Promise<GeolocationCoords | null> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      errorCode.value = 'unsupported'
      errorMessage.value = ERROR_MESSAGES.unsupported
      return null
    }

    loading.value = true
    errorCode.value = null
    errorMessage.value = null

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 60_000,
          timeout: 15_000,
          ...options,
        })
      })

      if (disposed) return null

      const next: GeolocationCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null,
      }
      coords.value = next
      return next
    } catch (err) {
      if (disposed) return null
      const code =
        err && typeof err === 'object' && 'code' in err
          ? mapError(err as GeolocationPositionError)
          : 'unknown'
      errorCode.value = code
      errorMessage.value = ERROR_MESSAGES[code]
      return null
    } finally {
      if (!disposed) loading.value = false
    }
  }

  return {
    coords,
    loading,
    errorCode,
    errorMessage,
    request,
  }
}
