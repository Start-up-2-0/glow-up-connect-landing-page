import { useRouter } from 'vue-router'
import type { NavLink } from '@/constants/landing'
import { ROUTE_PATHS } from '@/constants/routes'

const NAVBAR_OFFSET = 96

export function useLandingScroll() {
  const router = useRouter()

  function scrollToSection(hash: string) {
    const id = hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET
      window.scrollTo({ top, behavior: 'smooth' })
      return true
    }
    return false
  }

  async function goToSection(sectionId: string) {
    const hash = `#${sectionId}`

    if (router.currentRoute.value.path !== ROUTE_PATHS.HOME) {
      await router.push({ path: ROUTE_PATHS.HOME, hash })
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToSection(hash))
      })
      return
    }

    if (router.currentRoute.value.hash !== hash) {
      await router.push({ hash })
    }
    scrollToSection(hash)
  }

  async function goToNavLink(link: NavLink) {
    if (link.path) {
      if (router.currentRoute.value.path !== link.path) {
        await router.push(link.path)
      }
      return
    }
    await goToSection(link.id)
  }

  return { scrollToSection, goToSection, goToNavLink }
}
