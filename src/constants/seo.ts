import { FEATURE_FLAGS } from '@/config/features'
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
    title: FEATURE_FLAGS.lojasHabilitadas
      ? `${APP_NAME} — Agenda e gestão para barbearias, salões e profissionais`
      : `${APP_NAME} — Agenda e gestão para barbeiros e cabeleireiros autônomos`,
    description: FEATURE_FLAGS.lojasHabilitadas
      ? 'Organize agenda, clientes e financeiro de barbearias, salões e profissionais da beleza. Receba agendamentos online e acompanhe o dia a dia em um só sistema.'
      : 'Organize agenda, clientes e financeiro como barbeiro ou cabeleireiro autônomo. Receba agendamentos online e acompanhe o caixa no celular.',
    path: ROUTE_PATHS.HOME,
    ogType: 'website',
  },
  [ROUTE_PATHS.EXPLORAR_LOJAS]: {
    title: FEATURE_FLAGS.lojasHabilitadas
      ? `Explorar lojas e profissionais | ${APP_NAME}`
      : `Explorar profissionais | ${APP_NAME}`,
    description: FEATURE_FLAGS.lojasHabilitadas
      ? 'Encontre barbearias, salões e profissionais autônomos próximos no mapa. Veja avaliações, distância e agende online no Glow Up Connect.'
      : 'Encontre profissionais autônomos próximos no mapa. Veja avaliações, distância e agende online no Glow Up Connect.',
    path: ROUTE_PATHS.EXPLORAR_LOJAS,
    ogType: 'website',
  },
  [ROUTE_PATHS.TERMOS_DE_USO]: {
    title: `Termos de uso | ${APP_NAME}`,
    description:
      'Termos e condições de uso da plataforma Glow Up Connect. Leia as regras de cadastro, uso permitido e responsabilidades.',
    path: ROUTE_PATHS.TERMOS_DE_USO,
    ogType: 'article',
  },
  [ROUTE_PATHS.POLITICA_COOKIES]: {
    title: `Política de cookies | ${APP_NAME}`,
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
