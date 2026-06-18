export interface CookieConsentPreferences {
  version: string
  decidedAt: string | null
  essential: true
  thirdPartyServices: boolean
  analytics: boolean
}

export interface TermsAcceptance {
  version: string
  acceptedAt: string
}
