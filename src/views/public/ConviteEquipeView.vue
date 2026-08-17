<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AuthAvatarUpload from '@/components/auth/AuthAvatarUpload.vue'
import UserAvatar from '@/components/layout/UserAvatar.vue'
import TelefoneInput from '@/components/ui/TelefoneInput.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useApiError } from '@/composables/useApiError'
import { convitePublicoService } from '@/services/convitePublicoService'
import { appDashboardUrl, authConfirmEmailUrl } from '@/utils/authRedirect'
import { compressAvatarFile, validateAvatarFile } from '@/utils/avatarFile'
import { telefoneToApi } from '@/utils/formatters'
import type { ConvitePreview } from '@/types/convite.types'

type Modo = 'escolha' | 'login' | 'cadastro' | 'sucesso' | 'sucesso_cadastro'

const MENSAGEM_INDISPONIVEL =
  'Este convite expirou ou não está mais disponível. Solicite um novo convite ao administrador da loja.'

const ROLE_LABELS: Record<string, string> = {
  Owner: 'Dono',
  Admin: 'Administrador',
  Manager: 'Gerente',
  Receptionist: 'Recepcionista',
  Profissional: 'Profissional',
}

const route = useRoute()
const authStore = useAuthStore()
const { resolveError } = useApiError()

const token = computed(() => String(route.params.token ?? ''))
const loading = ref(true)
const submitting = ref(false)
const preview = ref<ConvitePreview | null>(null)
const previewError = ref<string | null>(null)
const formError = ref<string | null>(null)
const modo = ref<Modo>('escolha')

const loginEmail = ref('')
const loginSenha = ref('')
const nome = ref('')
const email = ref('')
const telefone = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const nomePublico = ref('')
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const avatarError = ref<string | null>(null)
const fotoFile = ref<File | null>(null)
const fotoPreview = ref<string | null>(null)
const fotoError = ref<string | null>(null)

const ehProfissional = computed(() => preview.value?.roleSugerida === 'Profissional')

const roleLabel = computed(() =>
  preview.value ? (ROLE_LABELS[preview.value.roleSugerida] ?? preview.value.roleSugerida) : '',
)

const expiraEmLabel = computed(() => {
  if (!preview.value) return ''
  return new Date(preview.value.expiraEm).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

function limparAvatar() {
  if (avatarPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }
  avatarFile.value = null
  avatarPreview.value = null
  avatarError.value = null
}

function limparFoto() {
  if (fotoPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(fotoPreview.value)
  }
  fotoFile.value = null
  fotoPreview.value = null
  fotoError.value = null
}

function onAvatarChange(file: File | null) {
  limparAvatar()
  if (!file) return
  const erro = validateAvatarFile(file)
  if (erro) {
    avatarError.value = erro
    return
  }
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

function onAvatarUploadError(message: string) {
  avatarError.value = message
}

function onFotoChange(file: File | null) {
  limparFoto()
  if (!file) return
  const erro = validateAvatarFile(file)
  if (erro) {
    fotoError.value = erro
    return
  }
  fotoFile.value = file
  fotoPreview.value = URL.createObjectURL(file)
}

function onFotoUploadError(message: string) {
  fotoError.value = message
}

async function carregarPreview() {
  loading.value = true
  previewError.value = null
  try {
    preview.value = await convitePublicoService.obterPreview(token.value)
    if (authStore.isAuthenticated) {
      modo.value = 'login'
    }
  } catch (err) {
    previewError.value = resolveError(err, MENSAGEM_INDISPONIVEL)
  } finally {
    loading.value = false
  }
}

async function aceitarLogado() {
  submitting.value = true
  formError.value = null
  try {
    if (!authStore.isAuthenticated) {
      await authStore.login({ email: loginEmail.value.trim(), senha: loginSenha.value })
    }
    await convitePublicoService.aceitar(token.value)
    modo.value = 'sucesso'
  } catch (err) {
    formError.value = resolveError(err, 'Não foi possível aceitar o convite.')
  } finally {
    submitting.value = false
  }
}

async function aceitarComCadastro() {
  formError.value = null
  avatarError.value = null
  fotoError.value = null

  if (!telefone.value.trim()) {
    formError.value = 'Informe o telefone.'
    return
  }

  if (senha.value !== confirmarSenha.value) {
    formError.value = 'As senhas não coincidem.'
    return
  }

  const nomeTrim = nome.value.trim()
  if (ehProfissional.value && !nomePublico.value.trim()) {
    nomePublico.value = nomeTrim
  }

  submitting.value = true
  try {
    const payload: Parameters<typeof convitePublicoService.aceitarComCadastro>[1] = {
      cadastro: {
        nome: nomeTrim,
        email: email.value.trim(),
        telefone: telefoneToApi(telefone.value),
        senha: senha.value,
      },
    }

    if (avatarFile.value) {
      const compressed = await compressAvatarFile(avatarFile.value)
      payload.cadastro.avatarBase64 = compressed.dataUrl
      payload.cadastro.avatarContentType = compressed.contentType
    }

    if (ehProfissional.value) {
      payload.nomePublico = nomePublico.value.trim() || nomeTrim

      if (fotoFile.value) {
        const compressed = await compressAvatarFile(fotoFile.value)
        payload.foto = compressed.dataUrl
        payload.fotoContentType = compressed.contentType
      }
    }

    await convitePublicoService.aceitarComCadastro(token.value, payload)
    modo.value = 'sucesso_cadastro'
  } catch (err) {
    formError.value = resolveError(err, 'Não foi possível criar a conta e aceitar o convite.')
  } finally {
    submitting.value = false
  }
}

function irParaDashboard() {
  window.location.assign(appDashboardUrl())
}

function irParaConfirmarEmail() {
  window.location.assign(authConfirmEmailUrl(appDashboardUrl()))
}

onMounted(() => {
  void carregarPreview()
})
</script>

<template>
  <div class="mx-auto max-w-xl px-4 pb-16">
    <div v-if="loading" class="rounded-2xl border border-glow-border-soft bg-glow-surface p-8 text-center">
      <p class="font-urbanist text-sm text-glow-text-subtle">Carregando convite…</p>
    </div>

    <div
      v-else-if="previewError"
      class="rounded-2xl border border-red-200 bg-glow-surface p-8 text-center dark:border-red-500/30"
    >
      <h1 class="font-satoshi text-xl font-bold text-glow-text">Convite indisponível</h1>
      <p class="mt-3 font-urbanist text-sm text-glow-text-subtle">{{ previewError }}</p>
    </div>

    <div v-else-if="preview" class="space-y-6">
      <header class="rounded-2xl border border-glow-border-soft bg-glow-surface p-6 sm:p-8">
        <p class="font-urbanist text-xs font-semibold uppercase tracking-wide text-glow-gold-cta">
          Convite para equipe
        </p>
        <h1 class="mt-2 font-satoshi text-2xl font-bold text-glow-text sm:text-3xl">
          {{ preview.nomeEstabelecimento }}
        </h1>
        <p class="mt-2 font-urbanist text-sm text-glow-text-subtle">
          Você foi convidado(a) como <strong class="text-glow-text">{{ roleLabel }}</strong>.
          Vagas restantes: {{ preview.vagasRestantes }}/{{ preview.limiteUsuarios }}.
          Válido até {{ expiraEmLabel }}.
        </p>
      </header>

      <section
        v-if="modo === 'escolha'"
        class="rounded-2xl border border-glow-border-soft bg-glow-surface p-6 space-y-3"
      >
        <h2 class="font-satoshi text-lg font-bold text-glow-text">Como deseja continuar?</h2>
        <button
          type="button"
          class="flex w-full flex-col rounded-xl border border-glow-border-soft px-4 py-4 text-left transition hover:border-glow-gold"
          @click="modo = 'login'"
        >
          <span class="font-satoshi font-semibold text-glow-text">Já tenho conta</span>
          <span class="mt-1 font-urbanist text-sm text-glow-text-subtle">
            Entre com e-mail e senha para aceitar o convite.
          </span>
        </button>
        <button
          type="button"
          class="flex w-full flex-col rounded-xl border border-glow-border-soft px-4 py-4 text-left transition hover:border-glow-gold"
          @click="modo = 'cadastro'"
        >
          <span class="font-satoshi font-semibold text-glow-text">Criar conta</span>
          <span class="mt-1 font-urbanist text-sm text-glow-text-subtle">
            Cadastre-se e entre na loja com a função do convite.
          </span>
        </button>
      </section>

      <section
        v-else-if="modo === 'login'"
        class="rounded-2xl border border-glow-border-soft bg-glow-surface p-6 space-y-4"
      >
        <h2 class="font-satoshi text-lg font-bold text-glow-text">
          {{ authStore.isAuthenticated ? 'Confirmar entrada' : 'Entrar' }}
        </h2>
        <p v-if="authStore.isAuthenticated && authStore.usuario" class="font-urbanist text-sm text-glow-text-subtle">
          Logado como {{ authStore.usuario.email }}. Confirme para entrar na loja.
        </p>
        <template v-else>
          <div>
            <label class="mb-1 block font-urbanist text-sm font-medium">E-mail</label>
            <input
              v-model="loginEmail"
              type="email"
              autocomplete="email"
              class="h-11 w-full rounded-lg border border-glow-border-soft bg-glow-canvas px-3 font-urbanist text-sm"
            />
          </div>
          <div>
            <label class="mb-1 block font-urbanist text-sm font-medium">Senha</label>
            <input
              v-model="loginSenha"
              type="password"
              autocomplete="current-password"
              class="h-11 w-full rounded-lg border border-glow-border-soft bg-glow-canvas px-3 font-urbanist text-sm"
            />
          </div>
        </template>
        <p v-if="formError" class="font-urbanist text-sm text-red-600">{{ formError }}</p>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-lg border border-glow-border-soft px-4 py-2.5 font-urbanist text-sm"
            @click="modo = 'escolha'"
          >
            Voltar
          </button>
          <button
            type="button"
            class="rounded-lg bg-glow-gold-cta px-4 py-2.5 font-satoshi text-sm font-semibold text-white disabled:opacity-60"
            :disabled="submitting"
            @click="aceitarLogado"
          >
            {{ submitting ? 'Confirmando…' : 'Aceitar convite' }}
          </button>
        </div>
      </section>

      <section
        v-else-if="modo === 'cadastro'"
        class="rounded-2xl border border-glow-border-soft bg-glow-surface p-6 space-y-4"
      >
        <h2 class="font-satoshi text-lg font-bold text-glow-text">Criar conta</h2>

        <div>
          <label class="mb-1 block font-urbanist text-sm font-medium">Nome</label>
          <input
            v-model="nome"
            type="text"
            autocomplete="name"
            class="h-11 w-full rounded-lg border border-glow-border-soft bg-glow-canvas px-3 font-urbanist text-sm"
          />
        </div>

        <div>
          <label class="mb-1 block font-urbanist text-sm font-medium">E-mail</label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            class="h-11 w-full rounded-lg border border-glow-border-soft bg-glow-canvas px-3 font-urbanist text-sm"
          />
        </div>

        <TelefoneInput
          v-model="telefone"
          label="Telefone"
          required
        />

        <template v-if="ehProfissional">
          <div class="space-y-4 border-t border-glow-border-soft pt-4">
            <p class="font-urbanist text-xs font-semibold uppercase tracking-wide text-glow-text-subtle">
              Perfil profissional
            </p>

            <div>
              <label class="mb-1 block font-urbanist text-sm font-medium">Nome público</label>
              <input
                v-model="nomePublico"
                type="text"
                placeholder="Como aparecerá para os clientes"
                class="h-11 w-full rounded-lg border border-glow-border-soft bg-glow-canvas px-3 font-urbanist text-sm"
              />
            </div>

            <AuthAvatarUpload
              label="Avatar da conta"
              @change="onAvatarChange"
              @error="onAvatarUploadError"
            />
            <div v-if="avatarPreview" class="flex items-center gap-3">
              <UserAvatar :src="avatarPreview" :name="nomePublico || nome" size="lg" />
              <button
                type="button"
                class="font-urbanist text-xs font-semibold text-glow-text-subtle hover:text-glow-text"
                @click="limparAvatar"
              >
                Remover avatar
              </button>
            </div>
            <p v-if="avatarError" class="font-urbanist text-xs text-red-600">{{ avatarError }}</p>

            <AuthAvatarUpload
              label="Foto do profissional"
              @change="onFotoChange"
              @error="onFotoUploadError"
            />
            <p class="font-urbanist text-xs text-glow-text-subtle">
              Imagem de apresentação aos clientes. Independente do avatar da conta.
            </p>
            <div v-if="fotoPreview" class="flex items-center gap-3">
              <UserAvatar :src="fotoPreview" :name="nomePublico || nome" size="lg" />
              <button
                type="button"
                class="font-urbanist text-xs font-semibold text-glow-text-subtle hover:text-glow-text"
                @click="limparFoto"
              >
                Remover foto
              </button>
            </div>
            <p v-if="fotoError" class="font-urbanist text-xs text-red-600">{{ fotoError }}</p>
          </div>
        </template>

        <div>
          <label class="mb-1 block font-urbanist text-sm font-medium">Senha</label>
          <input
            v-model="senha"
            type="password"
            autocomplete="new-password"
            class="h-11 w-full rounded-lg border border-glow-border-soft bg-glow-canvas px-3 font-urbanist text-sm"
          />
        </div>
        <div>
          <label class="mb-1 block font-urbanist text-sm font-medium">Confirmar senha</label>
          <input
            v-model="confirmarSenha"
            type="password"
            autocomplete="new-password"
            class="h-11 w-full rounded-lg border border-glow-border-soft bg-glow-canvas px-3 font-urbanist text-sm"
          />
        </div>

        <p v-if="formError" class="font-urbanist text-sm text-red-600">{{ formError }}</p>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-lg border border-glow-border-soft px-4 py-2.5 font-urbanist text-sm"
            @click="modo = 'escolha'"
          >
            Voltar
          </button>
          <button
            type="button"
            class="rounded-lg bg-glow-gold-cta px-4 py-2.5 font-satoshi text-sm font-semibold text-white disabled:opacity-60"
            :disabled="submitting"
            @click="aceitarComCadastro"
          >
            {{ submitting ? 'Criando…' : 'Criar conta e entrar' }}
          </button>
        </div>
      </section>

      <section
        v-else-if="modo === 'sucesso'"
        class="rounded-2xl border border-glow-border-soft bg-glow-surface p-8 text-center"
      >
        <h2 class="font-satoshi text-xl font-bold text-glow-text">Você entrou na equipe!</h2>
        <p class="mt-2 font-urbanist text-sm text-glow-text-subtle">
          Abra o painel para começar a usar a loja.
        </p>
        <button
          type="button"
          class="mt-6 rounded-lg bg-glow-gold-cta px-5 py-2.5 font-satoshi text-sm font-semibold text-white"
          @click="irParaDashboard"
        >
          Ir para o painel
        </button>
      </section>

      <section
        v-else-if="modo === 'sucesso_cadastro'"
        class="rounded-2xl border border-glow-border-soft bg-glow-surface p-8 text-center"
      >
        <h2 class="font-satoshi text-xl font-bold text-glow-text">Conta criada e convite aceito</h2>
        <p class="mt-2 font-urbanist text-sm text-glow-text-subtle">
          Confirme seu e-mail para acessar o painel. Depois disso, você já estará na equipe.
        </p>
        <button
          type="button"
          class="mt-6 rounded-lg bg-glow-gold-cta px-5 py-2.5 font-satoshi text-sm font-semibold text-white"
          @click="irParaConfirmarEmail"
        >
          Confirmar e-mail
        </button>
      </section>
    </div>
  </div>
</template>
