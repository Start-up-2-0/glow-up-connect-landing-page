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

export function visivelNoMarketplace(item: {
  tipoAssinatura?: TipoAssinatura | string | null
}): boolean {
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
    if (link.id !== LANDING_SECTIONS.explorarLojas || FEATURE_FLAGS.lojasHabilitadas) {
      return { ...link }
    }
    return { ...link, label: 'Explorar profissionais' }
  })
}
