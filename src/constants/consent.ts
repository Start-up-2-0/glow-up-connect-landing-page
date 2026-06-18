export const CONSENT_POLICY_VERSION = '1.0'
export const TERMS_VERSION = '1.0'

export const CONSENT_STORAGE_KEYS = {
  COOKIE_PREFERENCES: 'guc_cookie_consent',
  TERMS_ACCEPTANCE: 'guc_terms_acceptance',
} as const

export const THIRD_PARTY_PROVIDERS = [
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    purpose: 'Processamento de pagamentos (cartão, PIX e Checkout Pro).',
    dataShared: 'Dados de pagamento, identificação do titular e informações da transação.',
    privacyUrl: 'https://www.mercadopago.com.br/privacidade',
  },
] as const
