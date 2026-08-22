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
      label: 'Indicadores do dia',
      detail: 'Agenda, clientes e movimento do caixa em um olhar.',
      x: 34,
      y: 26,
      side: 'right',
    },
    {
      id: 'agenda-dia',
      label: 'Próximos horários',
      detail: 'Quem vem a seguir e o status de cada atendimento.',
      x: 42,
      y: 54,
      side: 'right',
    },
  ],
  agenda: [
    {
      id: 'status',
      label: 'Status claros',
      detail: 'Confirmado, realizado ou cancelado. Fácil de ler.',
      x: 78,
      y: 36,
      side: 'left',
    },
    {
      id: 'lista',
      label: 'Lista do dia',
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
      detail: 'Contato e último agendamento à mão.',
      x: 52,
      y: 46,
      side: 'right',
    },
  ],
  financeiro: [
    {
      id: 'caixa',
      label: 'Caixa do período',
      detail: 'Receita, despesa e resultado em cards simples.',
      x: 34,
      y: 26,
      side: 'right',
    },
    {
      id: 'fluxo',
      label: 'Fluxo de caixa',
      detail: 'Entradas e saídas por semana para acompanhar o movimento.',
      x: 48,
      y: 82,
      side: 'top',
    },
  ],
  comissao: [
    {
      id: 'metas',
      label: 'Comissões',
      detail: 'Valores por profissional, calculados no sistema.',
      x: 48,
      y: 58,
      side: 'right',
    },
  ],
  online: [
    {
      id: 'selfserve',
      label: 'Cliente agenda sozinho',
      detail: 'O cliente cria conta, escolhe serviço, vê duração e preço pelo celular.',
      x: 48,
      y: 44,
      side: 'right',
    },
  ],
  equipe: [
    {
      id: 'papeis',
      label: 'Papéis e acessos',
      detail: 'Dono, admin ou profissional. Cada um com seu acesso.',
      x: 50,
      y: 56,
      side: 'right',
    },
  ],
  explorar: [
    {
      id: 'vitrine',
      label: 'No mapa da região',
      detail: 'Apareça para quem busca barbearias e salões por perto.',
      x: 58,
      y: 64,
      side: 'left',
    },
  ],
  servicos: [
    {
      id: 'catalogo',
      label: 'Catálogo de serviços',
      detail: 'Preço, duração e status ativo/inativo por serviço.',
      x: 40,
      y: 40,
      side: 'right',
    },
  ],
  'agenda-detalhe': [
    {
      id: 'cliente',
      label: 'Dados do horário',
      detail: 'Nome, contato e status em um resumo.',
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
      label: 'Confirmação',
      detail: 'Serviço, data, horário e valor antes de finalizar.',
      x: 52,
      y: 46,
      side: 'right',
    },
  ],
}

export const STORY_CHAPTERS = {
  publico: { index: '01', label: 'Para quem é' },
  funcionamento: { index: '02', label: 'Como funciona' },
  funcionalidades: { index: '03', label: 'Funcionalidades' },
  beneficios: { index: '04', label: 'Benefícios' },
  explorar: { index: '05', label: 'Explorar lojas e profissionais' },
  demonstracao: { index: '06', label: 'Demonstração' },
  /** Seção oculta em produção (FEATURE_FLAGS.showSocialProof). */
  resultados: { index: '07', label: 'Resultados' },
  oferta: { index: '08', label: 'Planos' },
  cta: { index: '09', label: 'Comece agora' },
} as const
