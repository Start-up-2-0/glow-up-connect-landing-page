import { useHead } from '@unhead/vue'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { defaultOgImage, getSeoForPath, type SeoMeta } from '@/constants/seo'
import { siteUrl } from '@/constants/urls'

export function useSeo(meta?: Partial<SeoMeta> & { path?: string; image?: string }) {
  const path = meta?.path ?? '/'
  const base = getSeoForPath(path)
  const title = meta?.title ?? base.title
  const description = meta?.description ?? base.description
  const canonical = siteUrl(path === '/' ? '' : path)
  const ogImage = meta?.image?.trim() || defaultOgImage()
  const ogType = meta?.ogType ?? base.ogType ?? 'website'
  const robots = meta?.noindex ? 'noindex, nofollow' : 'index, follow'

  useHead({
    htmlAttrs: { lang: 'pt-BR' },
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: robots },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage },
      { property: 'og:locale', content: 'pt_BR' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    link: [{ rel: 'canonical', href: canonical }],
  })
}

export function useDynamicSeo(source: MaybeRefOrGetter<Partial<SeoMeta> & { path: string; image?: string }>) {
  const resolved = computed(() => toValue(source))

  useHead(() => {
    const meta = resolved.value
    const title = meta.title ?? 'Glow Up Connect'
    const description = meta.description ?? ''
    const canonical = siteUrl(meta.path === '/' ? '' : meta.path)
    const ogImage = meta.image?.trim() || defaultOgImage()
    const ogType = meta.ogType ?? 'website'
    const robots = meta.noindex ? 'noindex, nofollow' : 'index, follow'

    return {
      htmlAttrs: { lang: 'pt-BR' },
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'robots', content: robots },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonical },
        { property: 'og:type', content: ogType },
        { property: 'og:image', content: ogImage },
        { property: 'og:locale', content: 'pt_BR' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImage },
      ],
      link: [{ rel: 'canonical', href: canonical }],
    }
  })
}

export function useJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  const items = Array.isArray(data) ? data : [data]

  useHead({
    script: items.map((item) => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(item),
    })),
  })
}
