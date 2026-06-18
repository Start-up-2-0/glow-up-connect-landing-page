import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants/routes'

export const routes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.HOME,
    name: ROUTE_NAMES.LANDING,
    component: () => import('@/views/public/LandingView.vue'),
    meta: { layout: 'landing', title: 'Início' },
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
