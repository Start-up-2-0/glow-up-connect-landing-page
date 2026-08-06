export type CalloutSide = 'left' | 'right' | 'top' | 'bottom'

export interface ShotCallout {
  id: string
  label: string
  detail: string
  /**
   * Hotspot em % da ÁREA DA IMAGEM (sem o chrome do browser mock).
   * Sidebar do app ≈ 0–22% em X nas telas de gestão.
   */
  x: number
  y: number
  side: CalloutSide
}

/**
 * Callouts calibrados nas screenshots reais (1203×914).
 * Coordenadas = % da imagem do app.
 */
export const SHOWCASE_CALLOUTS: Record<string, ShotCallout[]> = {
  dashboard: [
    {
      id: 'kpi',
      label: 'Indicadores ao vivo',
      detail: 'Receita, agenda, clientes e avaliação em um olhar.',
      x: 34,
      y: 26,
      side: 'right',
    },
    {
      id: 'agenda-dia',
      label: 'Agenda de hoje',
      detail: 'Próximos horários com status — sem planilha.',
      x: 42,
      y: 54,
      side: 'right',
    },
  ],
  agenda: [
    {
      id: 'status',
      label: 'Status claros',
      detail: 'Confirmado, realizado ou cancelado — sem dúvida.',
      x: 78,
      y: 36,
      side: 'left',
    },
    {
      id: 'lista',
      label: 'Lista operacional',
      detail: 'Cliente, serviço, horário e valor em cada card.',
      x: 48,
      y: 58,
      side: 'right',
    },
  ],
  clientes: [
    {
      id: 'historico',
      label: 'Histórico do cliente',
      detail: 'Contato e último agendamento na ponta dos dedos.',
      x: 52,
      y: 46,
      side: 'right',
    },
  ],
  financeiro: [
    {
      id: 'caixa',
      label: 'Caixa sob controle',
      detail: 'Receita, despesa e lucro do período em cards claros.',
      x: 34,
      y: 26,
      side: 'right',
    },
    {
      id: 'fluxo',
      label: 'Fluxo de caixa',
      detail: 'Entradas e saídas por semana — decisões com número.',
      x: 48,
      y: 82,
      side: 'top',
    },
  ],
  comissao: [
    {
      id: 'metas',
      label: 'Comissões transparentes',
      detail: 'Metas e progresso por profissional, sem conflito.',
      x: 48,
      y: 58,
      side: 'right',
    },
  ],
  online: [
    {
      id: 'selfserve',
      label: 'Cliente agenda 24h',
      detail: 'Escolhe o serviço, vê duração e preço — sem WhatsApp.',
      x: 48,
      y: 44,
      side: 'right',
    },
  ],
  equipe: [
    {
      id: 'papeis',
      label: 'Papéis e acessos',
      detail: 'Dono, admin ou profissional — cada um com seu acesso.',
      x: 50,
      y: 56,
      side: 'right',
    },
  ],
  explorar: [
    {
      id: 'vitrine',
      label: 'Vitrine regional',
      detail: 'Lojas no mapa para atrair novos clientes na região.',
      x: 58,
      y: 64,
      side: 'left',
    },
  ],
  servicos: [
    {
      id: 'catalogo',
      label: 'Catálogo atualizado',
      detail: 'Preço, duração e status Ativo/Inativo por serviço.',
      x: 40,
      y: 40,
      side: 'right',
    },
  ],
  'agenda-detalhe': [
    {
      id: 'cliente',
      label: 'Contexto do cliente',
      detail: 'Nome, contato e status do horário em um resumo.',
      x: 40,
      y: 32,
      side: 'right',
    },
    {
      id: 'acoes',
      label: 'Ações rápidas',
      detail: 'Receber, remarcar ou cancelar sem sair da tela.',
      x: 40,
      y: 74,
      side: 'right',
    },
  ],
  'agendamento-confirmacao': [
    {
      id: 'resumo',
      label: 'Confirmação clara',
      detail: 'Serviço, data, horário e valor antes de finalizar.',
      x: 52,
      y: 46,
      side: 'right',
    },
  ],
}

export const STORY_CHAPTERS = {
  funcionamento: { index: '01', label: 'Como funciona' },
  funcionalidades: { index: '02', label: 'Funcionalidades' },
  beneficios: { index: '03', label: 'Benefícios' },
  demonstracao: { index: '04', label: 'Demonstração' },
  resultados: { index: '05', label: 'Resultados' },
  oferta: { index: '06', label: 'Planos' },
  cta: { index: '07', label: 'Comece agora' },
} as const
