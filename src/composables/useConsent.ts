import { storeToRefs } from 'pinia'
import { useConsentStore } from '@/stores/consent.store'

export function useConsent() {
  const store = useConsentStore()
  const { showBanner, preferencesModalOpen } = storeToRefs(store)

  return {
    showBanner,
    preferencesModalOpen,
    acceptAll: store.acceptAll,
    rejectNonEssential: store.rejectNonEssential,
    savePreferences: store.savePreferences,
    openPreferences: store.openPreferences,
    closePreferences: store.closePreferences,
  }
}
