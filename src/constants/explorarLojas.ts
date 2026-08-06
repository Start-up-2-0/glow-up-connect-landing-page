/**
 * Constantes e arquitetura de filtros da seção Explorar Lojas (landing).
 * Filtros client-side e server-side convivem; novos critérios entram aqui
 * sem precisar redesenhar a UI.
 */

export const EXPLORAR_DEFAULT_CENTER = {
  latitude: -10.9472,
  longitude: -37.0731,
  label: 'Aracaju, SE',
} as const

export const EXPLORAR_RAIO_KM_DEFAULT = 12
export const EXPLORAR_RAIO_KM_OPTIONS = [5, 12, 25, 50] as const

export const EXPLORAR_NOTA_MIN_OPTIONS = [
  { value: 0, label: 'Qualquer nota' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4,5+' },
] as const

/** Estado de filtros da exploração (extensível). */
export interface ExplorarLojasFiltros {
  /** Categoria no servidor (`proximos?categoriaId=`). */
  categoriaId: number | null
  /** Raio da busca no servidor. */
  raioKm: number
  /** Filtro local por nota mínima. */
  notaMinima: number
  /**
   * Preparados para evolução (ainda não ligados à API pública):
   * serviços, disponibilidade e janela de horário.
   */
  servicosIds: number[]
  apenasAbertos: boolean
  horarioInicio: string | null
  horarioFim: string | null
}

export function createDefaultExplorarFiltros(): ExplorarLojasFiltros {
  return {
    categoriaId: null,
    raioKm: EXPLORAR_RAIO_KM_DEFAULT,
    notaMinima: 0,
    servicosIds: [],
    apenasAbertos: false,
    horarioInicio: null,
    horarioFim: null,
  }
}
