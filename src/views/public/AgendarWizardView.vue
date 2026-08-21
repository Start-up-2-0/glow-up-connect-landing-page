<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseAlert from '@/components/feedback/BaseAlert.vue'
import AgendarWizardStepper from '@/components/agendar/AgendarWizardStepper.vue'
import AgendarProfissionalCard from '@/components/agendar/AgendarProfissionalCard.vue'
import AgendarOpcaoCard from '@/components/agendar/AgendarOpcaoCard.vue'
import AgendarServicoCard from '@/components/agendar/AgendarServicoCard.vue'
import AgendarResumoFooter from '@/components/agendar/AgendarResumoFooter.vue'
import AgendarCalendario from '@/components/agendar/AgendarCalendario.vue'
import AgendarRevisaoStep from '@/components/agendar/AgendarRevisaoStep.vue'
import AgendarSucessoConfirmacao from '@/components/agendar/AgendarSucessoConfirmacao.vue'
import AgendarLoginModal from '@/components/agendar/AgendarLoginModal.vue'
import UserAvatar from '@/components/layout/UserAvatar.vue'
import TelefoneInput from '@/components/ui/TelefoneInput.vue'
import { useAgendarWizard } from '@/composables/useAgendarWizard'
import { useApiError } from '@/composables/useApiError'
import { resolveAgendarFigmaStep } from '@/constants/agendarWizardSteps'
import {
  AGENDAR_BTN_CONTINUE_CLASS,
  AGENDAR_WIZARD_CONTENT_CLASS,
  GLOW_BUTTON_PRIMARY_CLASS,
  GLOW_INPUT_CLASS,
  GLOW_LABEL_CLASS,
} from '@/constants/designTokens'
import { useAuthStore } from '@/stores/auth.store'
import {
  appMeusAgendamentosUrl,
  authConfirmEmailUrl,
  authRegisterUrl,
} from '@/utils/authRedirect'
import {
  formatAgendaTime,
  formatCurrency,
  formatDateOnlyLong,
  formatDateOnlyMedium,
  toDateOnlyFromIsoUtc,
} from '@/utils/formatters'

const route = useRoute()
const authStore = useAuthStore()
const { resolveError } = useApiError()

const publicGuid = computed(() => String(route.params.publicGuid))
const profissionalPublicGuid = computed(() => {
  const fromQuery = route.query.profissional
  return typeof fromQuery === 'string' ? fromQuery : ''
})

const wizard = useAgendarWizard(publicGuid.value, profissionalPublicGuid.value)

const {
  step,
  modoIdentidade,
  modoProfissional,
  loading,
  submitting,
  error,
  contextoInvalido,
  agendamentoCriado,
  isVisitante,
  isModoInterno,
  identidadeTravada,
  profissionais,
  profissionalSelecionadoNome,
  profissionalSelecionadoFoto,
  estabelecimentoNome,
  servicos,
  slotsDoDia,
  datasAtendimento,
  minSelectableDate,
  maxSelectableDate,
  selectedServicoIds,
  selectedDate,
  selectedSlot,
  observacao,
  clienteNome,
  clienteEmail,
  clienteTelefone,
  cadastroSenha,
  selectedServicos,
  valorEstimado,
  duracaoTotal,
  activeProfissionalGuid,
  toggleServico,
  estadoSelecaoServico,
  escolherIdentidade,
  continuarComoLogado,
  escolherModoProfissional,
  selecionarProfissional,
  continuarDeProfissional,
  voltarParaIdentidade,
  voltarDeProfissional,
  voltarDeServicos,
  voltarDeData,
  voltarDeHorario,
  voltarDeConfirmar,
  continuarDeContato,
  selecionarData,
  goToData,
  goToHorario,
  goToConfirmar,
  confirmar,
  init,
  persistDraft,
} = wizard

const successMessage = ref<string | null>(null)
const loginModalOpen = ref(false)

const figmaStep = computed(() => resolveAgendarFigmaStep(step.value, isModoInterno.value))

const registerUrl = computed(() => authRegisterUrl(route.fullPath))
const confirmEmailUrl = computed(() => authConfirmEmailUrl(route.fullPath))
const meusAgendamentosUrl = computed(() => appMeusAgendamentosUrl())

const showBack = computed(() => {
  if (step.value === 'identidade' || step.value === 'sucesso' || step.value === 'sucesso_cadastro') {
    return false
  }
  // Após entrar com código/conta, a identificação fica travada.
  if (identidadeTravada.value) {
    if (step.value === 'profissional') return false
    if (step.value === 'servicos' && profissionalPublicGuid.value) return false
  }
  return true
})

const contatoValido = computed(
  () =>
    clienteNome.value.trim().length > 0
    && clienteEmail.value.trim().length > 0
    && clienteTelefone.value.trim().length > 0,
)

const showResumoFooter = computed(
  () => step.value === 'servicos' && selectedServicoIds.value.length > 0,
)

const isSuccessStep = computed(
  () => step.value === 'sucesso' || step.value === 'sucesso_cadastro',
)

const wizardAtivo = computed(
  () =>
    !contextoInvalido.value
    && (step.value === 'profissional'
      || step.value === 'identidade'
      || step.value === 'contato'
      || step.value === 'servicos'
      || step.value === 'data'
      || step.value === 'horario'
      || step.value === 'confirmar'
      || isSuccessStep.value),
)

const podeContinuarProfissional = computed(() => {
  if (modoProfissional.value === 'sem_preferencia') return true
  if (modoProfissional.value === 'especifico') return activeProfissionalGuid.value.length > 0
  return false
})

const sucessoProfissionalNome = computed(() => profissionalSelecionadoNome.value)

const sucessoServicosLabel = computed(() =>
  selectedServicos.value.map((servico) => servico.nome).join(', ') || '—',
)

const sucessoDataLabel = computed(() => {
  if (!agendamentoCriado.value) return '—'
  const isoDate = selectedDate.value || toDateOnlyFromIsoUtc(agendamentoCriado.value.inicio)
  return formatDateOnlyLong(isoDate)
})

const sucessoHorarioLabel = computed(() =>
  agendamentoCriado.value ? formatAgendaTime(agendamentoCriado.value.inicio) : '—',
)

const revisaoDataLabel = computed(() => formatDateOnlyLong(selectedDate.value))

const revisaoHorarioLabel = computed(() =>
  selectedSlot.value ? formatAgendaTime(selectedSlot.value.inicio) : '—',
)

const revisaoValorTotalLabel = computed(() => formatCurrency(valorEstimado.value))

const showRevisaoCliente = computed(
  () => isVisitante.value && (modoIdentidade.value === 'guest' || modoIdentidade.value === 'register'),
)

onMounted(async () => {
  try {
    await init()
  } catch (err) {
    error.value = resolveError(err)
  }
})

function handleBack() {
  if (step.value === 'contato') voltarParaIdentidade()
  else if (step.value === 'profissional') voltarDeProfissional()
  else if (step.value === 'servicos') voltarDeServicos()
  else if (step.value === 'data') voltarDeData()
  else if (step.value === 'horario') voltarDeHorario()
  else if (step.value === 'confirmar') voltarDeConfirmar()
}

function handleEscolherLogin() {
  if (authStore.isAuthenticated) {
    void handleLoginSuccess()
    return
  }
  persistDraft()
  loginModalOpen.value = true
}

async function handleLoginSuccess() {
  loginModalOpen.value = false
  try {
    await continuarComoLogado()
  } catch (err) {
    error.value = resolveError(err)
  }
}

function handleEscolherRegister() {
  escolherIdentidade('register')
}

function handleEscolherGuest() {
  escolherIdentidade('guest')
}

async function handleContinuarDeContato() {
  try {
    await continuarDeContato()
  } catch (err) {
    error.value = resolveError(err)
  }
}

async function handleContinuarDeProfissional() {
  try {
    await continuarDeProfissional()
  } catch (err) {
    error.value = resolveError(err)
  }
}

async function handleNextFromServicos() {
  try {
    await goToData()
  } catch (err) {
    error.value = resolveError(err)
  }
}

function onSelecionarData(data: string) {
  void selecionarData(data, false)
}

async function handleContinuarDeData() {
  try {
    await goToHorario()
  } catch (err) {
    error.value = resolveError(err)
  }
}

async function handleConfirmar() {
  try {
    await confirmar()
    successMessage.value = 'Agendamento criado com sucesso!'
  } catch (err) {
    error.value = resolveError(err, 'Não foi possível criar o agendamento.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div :class="isSuccessStep ? 'mx-auto w-full' : AGENDAR_WIZARD_CONTENT_CLASS">
      <BaseAlert v-if="contextoInvalido" variant="error" class="mb-6">
        Link de agendamento inválido. Solicite um novo link ao profissional.
      </BaseAlert>

      <BaseAlert v-else-if="error" variant="error" class="mb-6">{{ error }}</BaseAlert>

      <BaseAlert
        v-else-if="successMessage"
        variant="success"
        class="mb-6"
        dismissible
        @dismiss="successMessage = null"
      >
        {{ successMessage }}
      </BaseAlert>

      <template v-if="wizardAtivo">
        <AgendarWizardStepper
          v-if="figmaStep.showStepper"
          :step-index="figmaStep.index"
          :step-label="figmaStep.label"
          :show-back="showBack"
          @back="handleBack"
        />

        <!-- Identificação -->
        <div v-if="step === 'identidade'" class="agendar-step-panel">
          <div class="agendar-step-panel__icon" aria-hidden="true">
            <svg class="size-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3.5 13.2 8.3 18 9.5 13.2 10.7 12 15.5 10.8 10.7 6 9.5l4.8-1.2L12 3.5Z"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linejoin="round"
              />
              <path
                d="M18.5 14.5 19.1 16.8 21.5 17.5 19.1 18.2 18.5 20.5 17.9 18.2 15.5 17.5l2.4-.7.6-2.3Z"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div class="mb-6">
            <h1 class="agendar-section-title--identidade">Como deseja continuar?</h1>
            <p class="agendar-section-subtitle mt-2">
              Escolha a opção que melhor se encaixa para você.
            </p>
          </div>

          <div class="space-y-3">
            <AgendarOpcaoCard
              title="Entrar com meu código"
              description="Já tenho conta Glow. Uso meu código pessoal para agendar (sessão de 15 min)."
              action-label="Entrar"
              @action="handleEscolherLogin"
            >
              <template #icon>
                <svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="3" y="8" width="14" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2" />
                  <path d="M7 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.2" />
                </svg>
              </template>
            </AgendarOpcaoCard>

            <AgendarOpcaoCard
              title="Criar conta e agendar"
              description="Crie sua conta gratuitamente e acompanhe seus agendamentos."
              action-label="Criar conta"
              @action="handleEscolherRegister"
            >
              <template #icon>
                <svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="8" cy="7" r="3" stroke="currentColor" stroke-width="1.2" />
                  <path d="M3 17c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" stroke-width="1.2" />
                  <path d="M15 6v4M13 8h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                </svg>
              </template>
            </AgendarOpcaoCard>

            <AgendarOpcaoCard
              title="Agendar sem conta"
              description="Faça seu agendamento rapidamente sem criar uma conta."
              action-label="Continuar sem conta"
              @action="handleEscolherGuest"
            >
              <template #icon>
                <svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="7" r="3" stroke="currentColor" stroke-width="1.2" />
                  <path d="M4 17c0-2.8 2.7-5 6-5s6 2.2 6 5" stroke="currentColor" stroke-width="1.2" />
                </svg>
              </template>
            </AgendarOpcaoCard>
          </div>

          <div class="agendar-step-panel__footer">
            <span class="agendar-step-panel__footer-icon" aria-hidden="true">
              <svg class="size-4" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.5 13 3.5v4.2c0 3.1-2.1 5.4-5 6.3-2.9-.9-5-3.2-5-6.3V3.5L8 1.5Z"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.8 8.1 7.3 9.6 10.4 6.4"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <p class="agendar-step-panel__footer-text">
              Seus dados estão seguros conosco. Utilizamos criptografia para proteger suas
              informações.
            </p>
          </div>
        </div>

        <!-- Contato (guest) -->
        <div v-else-if="step === 'contato'" class="agendar-step-panel space-y-6">
          <h1 class="agendar-section-title">
            Preencha seus dados para continuar o agendamento
          </h1>

          <div class="space-y-6">
            <div>
              <label :class="GLOW_LABEL_CLASS" for="agendar-nome">Nome completo</label>
              <input
                id="agendar-nome"
                v-model="clienteNome"
                type="text"
                autocomplete="name"
                placeholder="Seu nome completo"
                :class="[GLOW_INPUT_CLASS, 'mt-2']"
              />
            </div>
            <div>
              <label :class="GLOW_LABEL_CLASS" for="agendar-email">E-mail</label>
              <input
                id="agendar-email"
                v-model="clienteEmail"
                type="email"
                autocomplete="email"
                placeholder="ex: usuário01@exemplo.com"
                :class="[GLOW_INPUT_CLASS, 'mt-2']"
              />
            </div>
            <TelefoneInput
              id="agendar-telefone"
              v-model="clienteTelefone"
              label="Telefone"
              autocomplete="tel"
              required
              placeholder="(00) 0 0000-0000"
            />
          </div>

          <button
            type="button"
            :class="GLOW_BUTTON_PRIMARY_CLASS"
            :disabled="!contatoValido"
            @click="handleContinuarDeContato"
          >
            Continuar o agendamento
          </button>
        </div>

        <!-- Profissional -->
        <div v-else-if="step === 'profissional'" class="agendar-step-panel space-y-6">
          <p class="text-center font-urbanist text-base text-glow-text-muted">
            Escolha um profissional ou deixe com a loja.
          </p>

          <div class="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              class="agendar-prof-modo-card"
              :class="{ 'agendar-prof-modo-card--selected': modoProfissional === 'especifico' }"
              @click="escolherModoProfissional('especifico')"
            >
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded bg-glow-hover-surface text-glow-text"
                aria-hidden="true"
              >
                <svg class="size-6" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.2" />
                  <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" stroke-width="1.2" />
                </svg>
              </div>
              <div class="min-w-0 text-left">
                <p class="font-urbanist text-sm font-semibold text-glow-text">Barbeiro específico</p>
                <p class="mt-1 font-urbanist text-xs text-glow-text-muted">
                  Quero escolher quem vai me atender.
                </p>
              </div>
            </button>

            <button
              type="button"
              class="agendar-prof-modo-card"
              :class="{ 'agendar-prof-modo-card--selected': modoProfissional === 'sem_preferencia' }"
              @click="escolherModoProfissional('sem_preferencia')"
            >
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded bg-glow-hover-surface text-glow-text"
                aria-hidden="true"
              >
                <svg class="size-6" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.2" />
                  <path d="M8 12h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                </svg>
              </div>
              <div class="min-w-0 text-left">
                <p class="font-urbanist text-sm font-semibold text-glow-text">Sem preferência</p>
                <p class="mt-1 font-urbanist text-xs text-glow-text-muted">
                  A loja é quem escolhe o profissional disponível.
                </p>
              </div>
            </button>
          </div>

          <div
            v-if="modoProfissional === 'especifico'"
            class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            <button
              v-for="prof in profissionais"
              :key="prof.publicGuid"
              type="button"
              class="agendar-prof-pick-card"
              :class="{ 'agendar-prof-pick-card--selected': activeProfissionalGuid === prof.publicGuid }"
              @click="selecionarProfissional(prof.publicGuid)"
            >
              <UserAvatar
                :src="prof.foto"
                :name="prof.nomePublico"
                size="md"
              />
              <span class="font-urbanist text-sm font-medium text-glow-text">{{ prof.nomePublico }}</span>
            </button>
          </div>

          <p
            v-if="modoProfissional === 'especifico' && profissionais.length === 0"
            class="font-urbanist text-sm text-glow-text-muted"
          >
            Nenhum profissional disponível para agendamento nesta loja.
          </p>

          <button
            type="button"
            :class="AGENDAR_BTN_CONTINUE_CLASS"
            :disabled="!podeContinuarProfissional || loading"
            @click="handleContinuarDeProfissional"
          >
            Continuar
          </button>
        </div>

        <!-- Serviços -->
        <div
          v-else-if="step === 'servicos'"
          class="agendar-step-panel space-y-5"
          :class="{ 'pb-36': showResumoFooter }"
        >
          <AgendarProfissionalCard
            v-if="profissionalSelecionadoNome !== '—'"
            :nome="profissionalSelecionadoNome"
            :foto="profissionalSelecionadoFoto"
            :estabelecimento-nome="estabelecimentoNome"
          />

          <h2 class="agendar-section-title">Selecione os serviços</h2>

          <p v-if="servicos.length === 0" class="font-urbanist text-sm text-glow-text-muted">
            Nenhum serviço disponível no momento.
          </p>

          <div class="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            <AgendarServicoCard
              v-for="servico in servicos"
              :key="servico.id"
              :nome="servico.nome"
              :descricao="servico.descricao"
              :duracao-minutos="servico.duracaoMinutosEstimada"
              :preco-minimo="servico.precoMinimo"
              :preco-maximo="servico.precoMaximo"
              :imagem="servico.imagem"
              :tipo-servico="servico.tipoServico"
              :selected="selectedServicoIds.includes(servico.id)"
              :disabled="estadoSelecaoServico(servico).disabled"
              :motivo-bloqueio="estadoSelecaoServico(servico).motivoBloqueio"
              @toggle="toggleServico(servico.id)"
            />
          </div>

          <AgendarResumoFooter
            v-if="showResumoFooter"
            :servicos-count="selectedServicoIds.length"
            :duracao-total="duracaoTotal"
            :valor-total="valorEstimado"
            :loading="loading"
            variant="fixed"
            @continuar="handleNextFromServicos"
          />
        </div>

        <!-- Data -->
        <div v-else-if="step === 'data'" class="agendar-step-panel space-y-6">
          <h2 class="agendar-section-title">
            Selecione um dia disponível para seu atendimento.
          </h2>

          <p
            v-if="!loading && datasAtendimento.length === 0"
            class="font-urbanist text-sm text-glow-text-muted"
          >
            {{ error ?? 'Não há dias de atendimento disponíveis com os serviços selecionados.' }}
          </p>

          <AgendarCalendario
            v-else-if="datasAtendimento.length > 0"
            :selected-date="selectedDate"
            :datas-permitidas="datasAtendimento"
            :min-date="minSelectableDate"
            :max-date="maxSelectableDate"
            :loading="loading"
            @select="onSelecionarData"
            @continuar="handleContinuarDeData"
          />
        </div>

        <!-- Horário -->
        <div v-else-if="step === 'horario'" class="agendar-step-panel space-y-6">
          <div>
            <h2 class="agendar-section-title">Selecione o horário desejado</h2>
            <p class="agendar-section-date mt-2">
              {{ formatDateOnlyMedium(selectedDate) }}
            </p>
          </div>

          <p
            v-if="!loading && slotsDoDia.length === 0"
            class="font-urbanist text-sm text-glow-text-muted"
          >
            Nenhum horário livre nesta data. Escolha outro dia disponível.
          </p>

          <div v-else-if="slotsDoDia.length > 0" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <button
              v-for="(slot, index) in slotsDoDia"
              :key="`${slot.inicio}-${index}`"
              type="button"
              class="agendar-slot-btn"
              :class="{ 'agendar-slot-btn--selected': selectedSlot?.inicio === slot.inicio }"
              @click="selectedSlot = slot"
            >
              {{ formatAgendaTime(slot.inicio) }}
            </button>
          </div>

          <button
            type="button"
            :class="AGENDAR_BTN_CONTINUE_CLASS"
            :disabled="!selectedSlot"
            @click="goToConfirmar()"
          >
            Continuar
          </button>
        </div>

        <!-- Revisão -->
        <div v-else-if="step === 'confirmar'" class="agendar-step-panel">
          <AgendarRevisaoStep
            :show-cliente="showRevisaoCliente"
            :cliente-nome="clienteNome"
            :cliente-email="clienteEmail"
            :cliente-telefone="clienteTelefone"
            :profissional-nome="profissionalSelecionadoNome"
            :profissional-foto="profissionalSelecionadoFoto"
            :estabelecimento-nome="estabelecimentoNome"
            :servicos="selectedServicos"
            :data-label="revisaoDataLabel"
            :horario-label="revisaoHorarioLabel"
            :duracao-total="duracaoTotal"
            :valor-total-label="revisaoValorTotalLabel"
            :show-register-password="modoIdentidade === 'register'"
            :submitting="submitting"
            v-model:cadastro-senha="cadastroSenha"
            v-model:observacao="observacao"
            @confirm="handleConfirmar"
          />
        </div>

        <!-- Sucesso cadastro -->
        <AgendarSucessoConfirmacao
          v-else-if="step === 'sucesso_cadastro' && agendamentoCriado"
          title="Conta e agendamento criados!"
          subtitle="Enviamos um e-mail de confirmação. Confirme sua conta para acompanhar seus agendamentos."
          :agendamento-id="agendamentoCriado.id"
          :profissional-nome="sucessoProfissionalNome"
          :servicos-label="sucessoServicosLabel"
          :data-label="sucessoDataLabel"
          :horario-label="sucessoHorarioLabel"
        >
          <a :href="confirmEmailUrl" class="w-full">
            <button type="button" :class="AGENDAR_BTN_CONTINUE_CLASS">
              Ir para confirmação de e-mail
            </button>
          </a>
        </AgendarSucessoConfirmacao>

        <!-- Sucesso -->
        <AgendarSucessoConfirmacao
          v-else-if="agendamentoCriado"
          title="Agendamento confirmado!"
          subtitle="Seu agendamento foi realizado com sucesso."
          :agendamento-id="agendamentoCriado.id"
          :profissional-nome="sucessoProfissionalNome"
          :servicos-label="sucessoServicosLabel"
          :data-label="sucessoDataLabel"
          :horario-label="sucessoHorarioLabel"
        >
          <template v-if="modoIdentidade === 'guest'">
            <a :href="registerUrl" class="w-full">
              <button type="button" :class="AGENDAR_BTN_CONTINUE_CLASS">
                Criar conta
              </button>
            </a>
          </template>
          <template v-else-if="modoIdentidade === 'login' || !isVisitante">
            <a :href="meusAgendamentosUrl" class="w-full">
              <button type="button" :class="AGENDAR_BTN_CONTINUE_CLASS">
                Ver meus agendamentos
              </button>
            </a>
          </template>
        </AgendarSucessoConfirmacao>
      </template>
    </div>

    <AgendarLoginModal
      :open="loginModalOpen"
      @close="loginModalOpen = false"
      @success="handleLoginSuccess"
    />
  </div>
</template>
