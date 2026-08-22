import type { MockupVariant } from '@/constants/landing'

import imgDashboard from '@/assets/landing/screenshots/dashboard-owner.png'
import imgDashboardPro from '@/assets/landing/screenshots/dashboard-profissional.png'
import imgAgenda from '@/assets/landing/screenshots/agenda-lista.png'
import imgAgendaDetalhe from '@/assets/landing/screenshots/agenda-detalhe.png'
import imgAgendaSemana from '@/assets/landing/screenshots/agenda-semana.png'
import imgClientes from '@/assets/landing/screenshots/clientes-lista.png'
import imgFinanceiro from '@/assets/landing/screenshots/financeiro-dashboard.png'
import imgComissoes from '@/assets/landing/screenshots/financeiro-comissoes.png'
import imgEquipe from '@/assets/landing/screenshots/equipe-lista.png'
import imgServicos from '@/assets/landing/screenshots/servicos-lista.png'
import imgExplorar from '@/assets/landing/screenshots/explorar-lojas.png'
import imgLoja from '@/assets/landing/screenshots/loja-detalhe.png'
import imgOnline from '@/assets/landing/screenshots/agendamento-servicos.png'
import imgAgendamentoData from '@/assets/landing/screenshots/agendamento-data.png'
import imgAgendamentoConfirmacao from '@/assets/landing/screenshots/agendamento-confirmacao.png'
import imgAssinatura from '@/assets/landing/screenshots/assinatura-plano.png'
import imgAgendamentoProfissional from '@/assets/landing/screenshots/agendamento-profissional.png'

export type ScreenshotId =
  | MockupVariant
  | 'dashboard-pro'
  | 'agenda-detalhe'
  | 'agenda-semana'
  | 'loja'
  | 'agendamento-data'
  | 'agendamento-confirmacao'
  | 'agendamento-profissional'
  | 'assinatura'

export interface ScreenshotAsset {
  src: string
  alt: string
}

/** Screenshots reais capturadas do app (tema claro oficial). */
export const SCREENSHOTS: Record<ScreenshotId, ScreenshotAsset> = {
  dashboard: {
    src: imgDashboard,
    alt: 'Dashboard do proprietário no Glow Up Connect com indicadores, agenda do dia e equipe',
  },
  'dashboard-pro': {
    src: imgDashboardPro,
    alt: 'Dashboard do profissional com próximos atendimentos e desempenho',
  },
  agenda: {
    src: imgAgenda,
    alt: 'Lista de agendamentos do mês com status e valores',
  },
  'agenda-semana': {
    src: imgAgendaSemana,
    alt: 'Agenda da semana com cards de atendimentos',
  },
  'agenda-detalhe': {
    src: imgAgendaDetalhe,
    alt: 'Detalhe de um agendamento com cliente, serviço e histórico',
  },
  clientes: {
    src: imgClientes,
    alt: 'Listagem de clientes com contato e último agendamento',
  },
  financeiro: {
    src: imgFinanceiro,
    alt: 'Dashboard financeiro com receita, despesas, lucro e fluxo de caixa',
  },
  comissao: {
    src: imgComissoes,
    alt: 'Gestão de comissões e metas dos profissionais',
  },
  equipe: {
    src: imgEquipe,
    alt: 'Gestão da equipe com papéis e membros ativos',
  },
  servicos: {
    src: imgServicos,
    alt: 'Catálogo de serviços do estabelecimento',
  },
  explorar: {
    src: imgExplorar,
    alt: 'Explorar lojas no mapa com filtros de barbearia e salão',
  },
  loja: {
    src: imgLoja,
    alt: 'Página pública do estabelecimento com horários e avaliações',
  },
  online: {
    src: imgOnline,
    alt: 'Fluxo de agendamento online — seleção de serviços',
  },
  'agendamento-profissional': {
    src: imgAgendamentoProfissional,
    alt: 'Fluxo de agendamento online — escolha do profissional',
  },
  'agendamento-data': {
    src: imgAgendamentoData,
    alt: 'Fluxo de agendamento online — seleção de data no calendário',
  },
  'agendamento-confirmacao': {
    src: imgAgendamentoConfirmacao,
    alt: 'Fluxo de agendamento online — revisão e confirmação',
  },
  relatorios: {
    src: imgFinanceiro,
    alt: 'Indicadores financeiros e evolução do saldo',
  },
  assinatura: {
    src: imgAssinatura,
    alt: 'Tela de assinatura e plano Premium ativo',
  },
}

export const HERO_SCREENSHOT = SCREENSHOTS.dashboard

export const VISUAL_DEMO_SCREENSHOTS = [
  {
    id: 'agenda-detalhe',
    titulo: 'Detalhe do agendamento',
    beneficio:
      'Cliente, serviço, valor e histórico na mesma tela — com ações para receber, remarcar ou cancelar.',
    screenshot: 'agenda-detalhe' as ScreenshotId,
  },
  {
    id: 'financeiro',
    titulo: 'Financeiro e comissões',
    beneficio:
      'Acompanhe receita, despesas e comissões da equipe com indicadores prontos para o fechamento do dia.',
    screenshot: 'comissao' as ScreenshotId,
  },
  {
    id: 'online',
    titulo: 'Agendamento online',
    beneficio:
      'O cliente escolhe serviço, data e horário. O compromisso entra direto na sua agenda.',
    screenshot: 'agendamento-confirmacao' as ScreenshotId,
  },
] as const
