import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  CONSENT_POLICY_VERSION,
  CONSENT_STORAGE_KEYS,
  TERMS_VERSION,
} from '@/constants/consent'
import { storage } from '@/utils/storage'
import type { CookieConsentPreferences, TermsAcceptance } from '@/types/consent.types'

function defaultPreferences(): CookieConsentPreferences {
  return {
    version: CONSENT_POLICY_VERSION,
    decidedAt: null,
    essential: true,
    thirdPartyServices: false,
    analytics: false,
  }
}

function readPreferences(): CookieConsentPreferences {
  try {
    const raw = storage.get(CONSENT_STORAGE_KEYS.COOKIE_PREFERENCES)
    if (!raw) return defaultPreferences()

    const parsed = JSON.parse(raw) as CookieConsentPreferences
    if (parsed.version !== CONSENT_POLICY_VERSION) {
      return defaultPreferences()
    }

    return {
      ...defaultPreferences(),
      ...parsed,
      essential: true,
    }
  } catch {
    return defaultPreferences()
  }
}

function readTerms(): TermsAcceptance | null {
  try {
    const raw = storage.get(CONSENT_STORAGE_KEYS.TERMS_ACCEPTANCE)
    if (!raw) return null

    const parsed = JSON.parse(raw) as TermsAcceptance
    if (parsed.version !== TERMS_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export const useConsentStore = defineStore('consent', () => {
  const preferences = ref<CookieConsentPreferences>(defaultPreferences())
  const terms = ref<TermsAcceptance | null>(null)
  const preferencesModalOpen = ref(false)

  const hasCookieDecision = computed(() => Boolean(preferences.value.decidedAt))
  const showBanner = computed(() => !hasCookieDecision.value)

  function hydrate() {
    preferences.value = readPreferences()
    terms.value = readTerms()
  }

  function acceptAll() {
    preferences.value = {
      version: CONSENT_POLICY_VERSION,
      decidedAt: new Date().toISOString(),
      essential: true,
      thirdPartyServices: true,
      analytics: false,
    }
    storage.set(CONSENT_STORAGE_KEYS.COOKIE_PREFERENCES, JSON.stringify(preferences.value))
  }

  function rejectNonEssential() {
    preferences.value = {
      version: CONSENT_POLICY_VERSION,
      decidedAt: new Date().toISOString(),
      essential: true,
      thirdPartyServices: false,
      analytics: false,
    }
    storage.set(CONSENT_STORAGE_KEYS.COOKIE_PREFERENCES, JSON.stringify(preferences.value))
  }

  function savePreferences(thirdPartyServices: boolean, analytics = false) {
    preferences.value = {
      version: CONSENT_POLICY_VERSION,
      decidedAt: new Date().toISOString(),
      essential: true,
      thirdPartyServices,
      analytics,
    }
    storage.set(CONSENT_STORAGE_KEYS.COOKIE_PREFERENCES, JSON.stringify(preferences.value))
    preferencesModalOpen.value = false
  }

  function openPreferences() {
    preferencesModalOpen.value = true
  }

  function closePreferences() {
    preferencesModalOpen.value = false
  }

  return {
    preferences,
    terms,
    preferencesModalOpen,
    showBanner,
    hydrate,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    openPreferences,
    closePreferences,
  }
})
