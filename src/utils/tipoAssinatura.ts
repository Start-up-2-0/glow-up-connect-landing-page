import { FEATURE_FLAGS } from '@/config/features'
import {
  LANDING_SECTIONS,
  NAV_LINKS,
  type NavLink,
} from '@/constants/landing'
import type { TipoAssinatura } from '@/types/plano.types'

export const TIPO_ASSINATURA_PADRAO: TipoAssinatura = FEATURE_FLAGS.lojasHabilitadas
  ? 'Estabelecimento'
  : 'ProfissionalAutonomo'

export function resolveTipoAssinatura(value?: string | null): TipoAssinatura {
  if (!FEATURE_FLAGS.lojasHabilitadas) return 'ProfissionalAutonomo'
  return value === 'ProfissionalAutonomo' ? 'ProfissionalAutonomo' : 'Estabelecimento'
}

export function visivelNoMarketplace<T extends { tipoAssinatura?: TipoAssinatura | string | null }>(
  item: T,
): boolean {
  if (FEATURE_FLAGS.lojasHabilitadas) return true
  return item.tipoAssinatura === 'ProfissionalAutonomo'
}

export function tipoAssinaturaParaCategorias(): TipoAssinatura | undefined {
  return FEATURE_FLAGS.lojasHabilitadas ? undefined : 'ProfissionalAutonomo'
}

export function semItensDeLoja<T extends { requerLojas?: boolean }>(items: readonly T[]): T[] {
  if (FEATURE_FLAGS.lojasHabilitadas) return [...items]
  return items.filter((item) => !item.requerLojas)
}

export function navLinksVisiveis(): NavLink[] {
  return NAV_LINKS.map((link) => {
    if (link.id !== LANDING_SECTIONS.explorarLojas) {
      return { ...link }
    }
    if (!FEATURE_FLAGS.lojasHabilitadas) {
      return { ...link, label: 'Explorar profissionais' }
    }
    return { ...link }
  })
}

/** Rótulos da vitrine pública quando lojas e autônomos coexistem. */
export function rotuloMarketplace(count: number): string {
  if (!FEATURE_FLAGS.lojasHabilitadas) {
    return count === 1 ? 'profissional' : 'profissionais'
  }
  return count === 1 ? 'resultado' : 'resultados'
}

export function tituloMarketplace(): string {
  return FEATURE_FLAGS.lojasHabilitadas
    ? 'Lojas e profissionais'
    : 'Profissionais'
}

export function placeholderBuscaMarketplace(): string {
  return FEATURE_FLAGS.lojasHabilitadas
    ? 'Buscar loja, profissional, bairro ou cidade…'
    : 'Buscar profissional, bairro ou cidade…'
}

export function vazioMarketplace(): string {
  return FEATURE_FLAGS.lojasHabilitadas
    ? 'Nenhuma loja ou profissional nesta área'
    : 'Nenhum profissional nesta área'
}
