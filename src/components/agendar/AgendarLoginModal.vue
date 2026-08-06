<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useApiError } from '@/composables/useApiError'
import {
  GLOW_BUTTON_PRIMARY_CLASS,
  GLOW_INPUT_CLASS,
  GLOW_LABEL_CLASS,
} from '@/constants/designTokens'
import { useAuthStore } from '@/stores/auth.store'
import { authConfirmEmailUrl } from '@/utils/authRedirect'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const authStore = useAuthStore()
const { resolveError, resolveErrorCode } = useApiError()

const codigo = ref('')
const errorMessage = ref('')
const needsEmailConfirm = ref(false)
const codigoInputRef = ref<HTMLInputElement | null>(null)

const confirmEmailUrl = computed(() => authConfirmEmailUrl())
const loading = computed(() => authStore.loading)

watch(
  () => props.open,
  async (open) => {
    if (!open) return
    errorMessage.value = ''
    needsEmailConfirm.value = false
    codigo.value = ''
    await nextTick()
    codigoInputRef.value?.focus()
  },
)

function close() {
  if (loading.value) return
  emit('close')
}

async function handleSubmit() {
  errorMessage.value = ''
  needsEmailConfirm.value = false

  const codigoTrim = codigo.value.trim()
  if (!codigoTrim) {
    errorMessage.value = 'Informe seu código de agendamento.'
    return
  }

  try {
    await authStore.loginComCodigo({ codigo: codigoTrim })
    emit('success')
  } catch (err) {
    if (resolveErrorCode(err) === 'EMAIL_NAO_CONFIRMADO') {
      needsEmailConfirm.value = true
      errorMessage.value = 'Confirme seu e-mail antes de usar o código.'
      return
    }
    errorMessage.value = resolveError(err, 'Código inválido. Verifique e tente novamente.')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agendar-login-title"
      @click.self="close"
      @keydown.escape="close"
    >
      <div
        class="w-full max-w-md rounded-2xl border border-white/15 bg-[#160e33] p-6 shadow-glow-lg sm:p-8"
      >
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="agendar-login-title"
              class="font-montserrat text-xl font-semibold text-white"
            >
              Entrar com meu código
            </h2>
            <p class="mt-1 font-poppins text-sm font-light text-white/55">
              Use o código pessoal da sua conta Glow. A sessão dura 15 minutos ou até confirmar o
              agendamento.
            </p>
          </div>
          <button
            type="button"
            class="rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
            :disabled="loading"
            @click="close"
          >
            <svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label :class="GLOW_LABEL_CLASS" for="agendar-login-codigo">Código de agendamento</label>
            <input
              id="agendar-login-codigo"
              ref="codigoInputRef"
              v-model="codigo"
              type="text"
              autocomplete="one-time-code"
              placeholder="XXXX-XXXX-XXXX"
              spellcheck="false"
              :class="[GLOW_INPUT_CLASS, 'mt-2 font-mono tracking-wider uppercase']"
              :disabled="loading"
            />
            <p class="mt-2 font-poppins text-xs text-white/40">
              Encontre o código em Meu perfil → Segurança no app Glow Up Connect.
            </p>
          </div>

          <p
            v-if="errorMessage"
            class="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100"
            role="alert"
          >
            {{ errorMessage }}
            <a
              v-if="needsEmailConfirm"
              :href="confirmEmailUrl"
              class="mt-1 block font-medium text-glow-gold hover:underline"
            >
              Ir para confirmação de e-mail
            </a>
          </p>

          <button
            type="submit"
            :class="GLOW_BUTTON_PRIMARY_CLASS"
            :disabled="loading"
          >
            {{ loading ? 'Validando…' : 'Continuar agendamento' }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
