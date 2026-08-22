import { formatTelefone, normalizeTelefone } from '@/utils/formatters'

/** Dígitos de `VITE_WHATSAPP_NUMBER`, ou null se a env estiver vazia. */
export function getWhatsappDigits(): string | null {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined
  const digits = normalizeTelefone(phone)
  return digits || null
}

export function getWhatsappHref(text?: string): string | null {
  const digits = getWhatsappDigits()
  if (!digits) return null
  if (!text) return `https://wa.me/${digits}`
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export function getWhatsappLabel(): string | null {
  const digits = getWhatsappDigits()
  return digits ? formatTelefone(digits) : null
}

export function getWhatsappTelHref(): string | null {
  const digits = getWhatsappDigits()
  return digits ? `tel:+${digits}` : null
}
