import { APP_NAME } from '@/constants/storageKeys'
import { ROUTE_PATHS } from '@/constants/routes'
import { siteUrl } from '@/constants/urls'

export interface SeoMeta {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article'
  noindex?: boolean
}

export const SEO_BY_PATH: Record<string, SeoMeta> = {
  [ROUTE_PATHS.HOME]: {
    title: `${APP_NAME} — Gestão para barbearias e salões`,
    description:
      'Plataforma de gestão para barbearias e salões: agenda, clientes, financeiro, comissões, equipe e agendamento online.',
    path: ROUTE_PATHS.HOME,
    ogType: 'website',
  },
  [ROUTE_PATHS.EXPLORAR_LOJAS]: {
    title: `Explorar Lojas | ${APP_NAME}`,
    description:
      'Encontre barbearias e salões próximos no mapa. Veja avaliações, distância e agende online no Glow Up Connect.',
    path: ROUTE_PATHS.EXPLORAR_LOJAS,
    ogType: 'website',
  },
  [ROUTE_PATHS.TERMOS_DE_USO]: {
    title: `Termos de Uso | ${APP_NAME}`,
    description:
      'Termos e condições de uso da plataforma Glow Up Connect. Leia as regras de cadastro, uso permitido e responsabilidades.',
    path: ROUTE_PATHS.TERMOS_DE_USO,
    ogType: 'article',
  },
  [ROUTE_PATHS.POLITICA_COOKIES]: {
    title: `Política de Cookies | ${APP_NAME}`,
    description:
      'Saiba como a Glow Up Connect utiliza cookies e tecnologias similares para login, preferências e serviços de terceiros.',
    path: ROUTE_PATHS.POLITICA_COOKIES,
    ogType: 'article',
  },
}

export function getSeoForPath(path: string): SeoMeta {
  return SEO_BY_PATH[path] ?? SEO_BY_PATH[ROUTE_PATHS.HOME]
}

export function defaultOgImage(): string {
  return siteUrl('/og-image.jpg')
}
