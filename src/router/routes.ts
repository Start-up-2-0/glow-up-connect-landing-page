import type { RouteRecordRaw } from 'vue-router'
import { FEATURE_FLAGS } from '@/config/features'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants/routes'

export const routes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.HOME,
    name: ROUTE_NAMES.LANDING,
    component: () => import('@/views/public/LandingView.vue'),
    meta: { layout: 'landing', title: 'Início' },
  },
  {
    path: ROUTE_PATHS.EXPLORAR_LOJAS,
    name: ROUTE_NAMES.EXPLORAR_LOJAS,
    component: () => import('@/views/public/ExplorarLojasView.vue'),
    meta: { layout: 'landing', title: FEATURE_FLAGS.lojasHabilitadas ? 'Explorar Lojas' : 'Explorar profissionais' },
  },
  {
    path: ROUTE_PATHS.LOJA_AGENDAR,
    name: ROUTE_NAMES.LOJA_AGENDAR,
    component: () => import('@/views/public/AgendarWizardView.vue'),
    meta: { layout: 'agendar-publico', title: 'Agendar' },
  },
  {
    path: ROUTE_PATHS.LOJA_PUBLICA,
    name: ROUTE_NAMES.LOJA_PUBLICA,
    component: () => import('@/views/public/LojaPublicaView.vue'),
    meta: { layout: 'landing', title: 'Loja' },
  },
  {
    path: ROUTE_PATHS.CONVITE_EQUIPE,
    name: ROUTE_NAMES.CONVITE_EQUIPE,
    component: () => import('@/views/public/ConviteEquipeView.vue'),
    meta: { layout: 'agendar-publico', title: 'Convite para equipe' },
  },
  {
    path: ROUTE_PATHS.TERMOS_DE_USO,
    name: ROUTE_NAMES.TERMOS_DE_USO,
    component: () => import('@/views/public/TermosDeUsoView.vue'),
    meta: { layout: 'public', title: 'Termos de uso' },
  },
  {
    path: ROUTE_PATHS.POLITICA_COOKIES,
    name: ROUTE_NAMES.POLITICA_COOKIES,
    component: () => import('@/views/public/PoliticaCookiesView.vue'),
    meta: { layout: 'public', title: 'Política de cookies' },
  },
]
