export const LANDING_SECTIONS = {
  inicio: 'inicio',
  publico: 'publico',
  plataforma: 'plataforma',
  comoFunciona: 'como-funciona',
  funcionalidades: 'funcionalidades',
  beneficios: 'beneficios',
  explorarLojas: 'explorar-lojas',
  provaSocial: 'prova-social',
  planos: 'planos',
  faq: 'faq',
} as const

export type LandingSectionId = (typeof LANDING_SECTIONS)[keyof typeof LANDING_SECTIONS]

export type FeatureIconId =
  | 'agenda'
  | 'clientes'
  | 'financeiro'
  | 'comissao'
  | 'equipe'
  | 'online'
  | 'relatorios'
  | 'explorar'
  | 'automacao'
  | 'notificacao'
  | 'dashboard'
  | 'servicos'

export type MockupVariant =
  | 'dashboard'
  | 'agenda'
  | 'clientes'
  | 'financeiro'
  | 'comissao'
  | 'online'
  | 'equipe'
  | 'explorar'
  | 'relatorios'
  | 'servicos'

export interface ShowcaseItem {
  id: string
  titulo: string
  beneficio: string
  mockup: MockupVariant
  requerLojas?: boolean
}

export interface HowItWorksStep {
  step: string
  titulo: string
  descricao: string
}

export interface FeatureItem {
  titulo: string
  descricao: string
  beneficio: string
  icon: FeatureIconId
  requerLojas?: boolean
}

export interface BenefitItem {
  titulo: string
  descricao: string
  icon: FeatureIconId
  requerLojas?: boolean
}

export interface TestimonialItem {
  nome: string
  cargo: string
  estabelecimento: string
  quote: string
  rating: number
}

export interface FaqItem {
  pergunta: string
  resposta: string
  requerLojas?: boolean
}

export type NavLink = {
  label: string
  /** Identificador usado no estado ativo da navbar. */
  id: string
  /** Se definido, navega para a rota em vez de scroll na home. */
  path?: string
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Plataforma', id: LANDING_SECTIONS.plataforma },
  { label: 'Como funciona', id: LANDING_SECTIONS.comoFunciona },
  { label: 'Funcionalidades', id: LANDING_SECTIONS.funcionalidades },
  { label: 'Benefícios', id: LANDING_SECTIONS.beneficios },
  { label: 'Explorar lojas', id: LANDING_SECTIONS.explorarLojas, path: '/explorar-lojas' },
  { label: 'Planos', id: LANDING_SECTIONS.planos },
  { label: 'FAQ', id: LANDING_SECTIONS.faq },
] as const

export const HERO_COPY = {
  eyebrow: 'Para barbearias, salões e profissionais da beleza',
  tituloLinha1: 'Agenda, clientes e financeiro',
  tituloDestaque: 'no mesmo sistema',
  tituloLinha2: '',
  subtitulo:
    'A Glow ajuda barbeiros, cabeleireiros e salões a organizar horários, acompanhar o caixa e receber agendamentos online — sem depender só do WhatsApp e de planilhas.',
  audiencia: ['Barbeiros', 'Cabeleireiros(as)', 'Barbearias', 'Salões'] as const,
  portes: [
    { dt: 'Autônomo', dd: 'Atende sozinho' },
    { dt: 'Com equipe', dd: 'Barbearia ou salão' },
    { dt: 'Operação maior', dd: 'Vários profissionais' },
  ] as const,
  ctaPrimario: 'Criar minha conta',
  ctaSecundario: 'Ver como funciona',
} as const

export type AudiencePorteId = 'pequeno' | 'medio' | 'grande'

export interface AudienceProfile {
  id: AudiencePorteId
  step: string
  porte: string
  titulo: string
  descricao: string
  pontos: readonly string[]
  tipoAssinatura: 'Estabelecimento' | 'ProfissionalAutonomo'
  cta: string
  icon: FeatureIconId
}

export const AUDIENCE_INTRO = {
  eyebrow: 'Para quem é',
  titulo: 'Feita para quem vive',
  destaque: 'de atendimento',
  subtitulo:
    'Se você corta cabelo, faz barba ou gerencia um salão, a Glow foi pensada para a sua rotina — do profissional que atende sozinho ao estabelecimento com equipe.',
  oficios: ['Barbeiros', 'Cabeleireiros(as)', 'Barbearias', 'Salões'] as const,
} as const

export const AUDIENCE_PROFILES: readonly AudienceProfile[] = [
  {
    id: 'pequeno',
    step: '01',
    porte: 'Profissional autônomo',
    titulo: 'Quem atende sozinho',
    descricao:
      'Barbeiros e cabeleireiros(as) que precisam de agenda no celular, histórico de clientes e controle simples do que entra e sai.',
    pontos: [
      'Agenda e clientes no celular',
      'Link de agendamento online',
      'Caixa sem planilha',
    ],
    tipoAssinatura: 'ProfissionalAutonomo',
    cta: 'Ver planos para autônomos',
    icon: 'servicos',
  },
  {
    id: 'medio',
    step: '02',
    porte: 'Barbearia ou salão',
    titulo: 'Negócios com equipe',
    descricao:
      'Quando o WhatsApp não dá mais conta: vários profissionais, horários cruzados e comissões que precisam fechar certo.',
    pontos: [
      'Agenda por profissional',
      'Comissões claras',
      'Acessos por função',
    ],
    tipoAssinatura: 'Estabelecimento',
    cta: 'Ver planos para o salão',
    icon: 'equipe',
  },
  {
    id: 'grande',
    step: '03',
    porte: 'Operação maior',
    titulo: 'Muitos profissionais, um painel',
    descricao:
      'Alta ocupação e vários atendentes. Você acompanha agenda, caixa e indicadores da operação em um só lugar.',
    pontos: [
      'Visão unificada do dia',
      'Indicadores de ocupação',
      'Controle de acessos e caixa',
    ],
    tipoAssinatura: 'Estabelecimento',
    cta: 'Ver planos para a operação',
    icon: 'dashboard',
  },
]

export const SHOWCASE_INTRO = {
  eyebrow: 'Na prática',
  titulo: 'O que você usa',
  destaque: 'no dia a dia',
  subtitulo:
    'Telas reais da plataforma: da agenda ao financeiro, pensadas para a rotina de barbearias, salões e profissionais autônomos.',
} as const

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'dashboard',
    titulo: 'Painel do dia',
    beneficio:
      'Veja atendimentos, ocupação e movimento do caixa assim que abre o sistema — sem montar relatório na mão.',
    mockup: 'dashboard',
  },
  {
    id: 'agenda',
    titulo: 'Agenda por profissional',
    beneficio:
      'Organize horários, evite choques de horário e saiba quem está livre em cada cadeira.',
    mockup: 'agenda',
  },
  {
    id: 'clientes',
    titulo: 'Cadastro de clientes',
    beneficio:
      'Guarde histórico, contato e preferências para lembrar do cliente na próxima visita.',
    mockup: 'clientes',
  },
  {
    id: 'financeiro',
    titulo: 'Financeiro do negócio',
    beneficio:
      'Registre entradas e saídas e acompanhe o resultado do período com clareza.',
    mockup: 'financeiro',
  },
  {
    id: 'comissao',
    titulo: 'Comissões',
    beneficio:
      'Defina as regras e acompanhe o valor de cada profissional — menos discussão no fechamento.',
    mockup: 'comissao',
    requerLojas: true,
  },
  {
    id: 'online',
    titulo: 'Agendamento online',
    beneficio:
      'O cliente escolhe serviço, profissional e horário pelo celular. Você recebe o horário na agenda.',
    mockup: 'online',
  },
  {
    id: 'equipe',
    titulo: 'Equipe e acessos',
    beneficio:
      'Cadastre profissionais, defina papéis e controle o que cada um pode ver e fazer.',
    mockup: 'equipe',
    requerLojas: true,
  },
  {
    id: 'explorar',
    titulo: 'Explorar lojas',
    beneficio:
      'Apareça no mapa para quem busca barbearias e salões na região e recebe novos agendamentos.',
    mockup: 'explorar',
  },
  {
    id: 'servicos',
    titulo: 'Catálogo de serviços',
    beneficio:
      'Cadastre nome, preço, duração e status — o menu do negócio fica sempre atualizado.',
    mockup: 'servicos',
  },
]

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: '01',
    titulo: 'Crie sua conta',
    descricao:
      'Cadastre-se como profissional autônomo ou estabelecimento. Funciona no navegador, sem instalar nada.',
  },
  {
    step: '02',
    titulo: 'Monte o catálogo',
    descricao:
      'Inclua serviços, preços e horários de atendimento. Se tiver equipe, adicione os profissionais.',
  },
  {
    step: '03',
    titulo: 'Abra o agendamento',
    descricao:
      'Compartilhe o link para o cliente marcar online — ou registre horários na recepção.',
  },
  {
    step: '04',
    titulo: 'Acompanhe a operação',
    descricao:
      'Use a agenda, o caixa e os indicadores no dia a dia. O foco continua no atendimento.',
  },
]

export const FEATURES: FeatureItem[] = [
  {
    icon: 'agenda',
    titulo: 'Agenda unificada',
    descricao: 'Horários de todos os profissionais em um calendário fácil de ler no celular ou no computador.',
    beneficio: 'Menos conflito de horário e cadeira melhor aproveitada.',
  },
  {
    icon: 'online',
    titulo: 'Agendamento online',
    descricao: 'O cliente escolhe serviço, profissional e horário pelo link da sua página.',
    beneficio: 'Horários preenchidos mesmo fora do expediente.',
  },
  {
    icon: 'clientes',
    titulo: 'Clientes',
    descricao: 'Histórico de serviços e dados de contato de quem já passou pela cadeira.',
    beneficio: 'Atendimento mais pessoal e retorno mais fácil.',
  },
  {
    icon: 'financeiro',
    titulo: 'Controle financeiro',
    descricao: 'Registre movimentações e acompanhe o resultado do negócio.',
    beneficio: 'Você sabe como está o caixa sem abrir várias planilhas.',
  },
  {
    icon: 'comissao',
    titulo: 'Comissões',
    descricao: 'Regras por profissional e serviço, calculadas a partir dos atendimentos.',
    beneficio: 'Fechamento mais transparente para dono e equipe.',
    requerLojas: true,
  },
  {
    icon: 'equipe',
    titulo: 'Gestão de equipe',
    descricao: 'Papéis, permissões e organização dos profissionais no mesmo painel.',
    beneficio: 'A operação cresce sem perder o controle de acessos.',
    requerLojas: true,
  },
  {
    icon: 'relatorios',
    titulo: 'Indicadores',
    descricao: 'Painéis com ocupação, faturamento e desempenho da rotina.',
    beneficio: 'Decisões com base no que realmente aconteceu no salão.',
  },
  {
    icon: 'notificacao',
    titulo: 'Lembretes',
    descricao: 'Avisos de confirmação que ajudam a reduzir faltas de última hora.',
    beneficio: 'Menos buracos na agenda do dia.',
  },
]

export const BUSINESS_BENEFITS: BenefitItem[] = [
  {
    icon: 'agenda',
    titulo: 'Agenda fora do WhatsApp',
    descricao:
      'Horários ficam registrados no sistema, não espalhados em conversas e anotações.',
  },
  {
    icon: 'notificacao',
    titulo: 'Menos faltas no dia',
    descricao:
      'Lembretes e confirmações ajudam o cliente a lembrar do horário marcado.',
  },
  {
    icon: 'financeiro',
    titulo: 'Caixa mais claro',
    descricao:
      'Entradas, saídas e o que cada atendimento gerou — visíveis quando você precisa.',
  },
  {
    icon: 'equipe',
    titulo: 'Equipe alinhada',
    descricao:
      'Comissões e acessos definidos reduzem mal-entendido entre dono e profissionais.',
    requerLojas: true,
  },
  {
    icon: 'clientes',
    titulo: 'Cliente reconhecido',
    descricao:
      'Histórico à mão para retomar o atendimento com contexto, não do zero.',
  },
  {
    icon: 'relatorios',
    titulo: 'Visão do negócio',
    descricao:
      'Indicadores mostram ocupação e movimento — útil para planejar horários e capacidade.',
  },
  {
    icon: 'automacao',
    titulo: 'Menos retrabalho',
    descricao:
      'Agenda, clientes e caixa no mesmo fluxo — menos digitar a mesma informação duas vezes.',
  },
  {
    icon: 'dashboard',
    titulo: 'Rotina mais leve',
    descricao:
      'Um painel para o que importa no dia: quem vem, quanto entra e o que falta fechar.',
  },
]

/** Dados ilustrativos — só exibidos se FEATURE_FLAGS.showSocialProof estiver ativo. */
export const SOCIAL_STATS = [
  { valor: '4k+', rotulo: 'Usuários na plataforma', hint: 'Em crescimento contínuo' },
  { valor: '12k+', rotulo: 'Agendamentos realizados', hint: 'Operação validada no dia a dia' },
  { valor: '2k+', rotulo: 'Profissionais conectados', hint: 'Pequenos, médios e grandes negócios' },
  { valor: '96%', rotulo: 'Aprovação dos clientes', hint: 'Experiência que gera confiança' },
] as const

/** Depoimentos ilustrativos — só exibidos se FEATURE_FLAGS.showSocialProof estiver ativo. */
export const TESTIMONIALS: TestimonialItem[] = [
  {
    nome: 'Lucas Ferreira',
    cargo: 'Pequeno negócio · Barbeiro autônomo',
    estabelecimento: 'Studio Lucas Cut',
    quote:
      'Atendo sozinho e não precisava de um sistema de salão inteiro. A agenda e o financeiro cabem na minha rotina — e o cliente marca sozinho.',
    rating: 5,
  },
  {
    nome: 'Camila Duarte',
    cargo: 'Médio negócio · Proprietária',
    estabelecimento: 'Salão Bela Arte',
    quote:
      'Com a equipe crescendo, o WhatsApp não dava conta. Agora cada profissional tem horário, comissão e o caixa fecha sem discussão.',
    rating: 5,
  },
  {
    nome: 'Rafael Mendes',
    cargo: 'Grande negócio · Sócio',
    estabelecimento: 'Barber House 97',
    quote:
      'Várias cadeiras, muita gente na operação. O painel unifica agenda, ocupação e resultado — eu vejo o negócio inteiro, não só o dia.',
    rating: 5,
  },
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    pergunta: 'A Glow serve para barbearias e salões de portes diferentes?',
    resposta:
      'Sim. Profissionais autônomos usam agenda, clientes e financeiro de forma enxuta. Barbearias e salões com equipe ganham agenda por profissional, comissões e controle de acessos.',
    requerLojas: true,
  },
  {
    pergunta: 'Sou barbeiro ou cabeleireiro autônomo. Consigo usar?',
    resposta:
      'Sim. Há planos para quem atende sozinho: agenda, cadastro de clientes, financeiro e agendamento online, sem precisar montar equipe.',
  },
  {
    pergunta: 'Funciona para estabelecimentos com vários profissionais?',
    resposta:
      'Sim. Você organiza a agenda por pessoa, define comissões e controla o que cada perfil pode acessar.',
    requerLojas: true,
  },
  {
    pergunta: 'Preciso instalar algum programa?',
    resposta:
      'Não. A Glow funciona no navegador, no computador ou no celular. Basta criar a conta e configurar o negócio.',
  },
  {
    pergunta: 'Meus clientes conseguem agendar online?',
    resposta:
      'Sim. Eles escolhem serviço e horário pelo link. Você acompanha tudo na agenda do estabelecimento ou do profissional.',
  },
  {
    pergunta: 'Como funcionam as comissões?',
    resposta:
      'Você define as regras. O sistema calcula com base nos atendimentos, para dono e equipe acompanharem os valores com clareza.',
    requerLojas: true,
  },
  {
    pergunta: 'Posso começar em um plano menor e mudar depois?',
    resposta:
      'Sim. Comece no que faz sentido hoje — autônomo ou estabelecimento — e altere o plano quando a operação pedir mais recursos.',
  },
  {
    pergunta: 'Tem suporte se eu travar na configuração?',
    resposta:
      'Sim. Dá para falar com a equipe pelos canais de contato no rodapé. Também respondemos dúvidas comuns aqui no FAQ.',
  },
]

export const FINAL_CTA = {
  titulo: 'Pronto para organizar',
  destaque: 'a rotina do negócio?',
  subtitulo:
    'Crie sua conta, cadastre serviços e horários e comece a receber agendamentos com agenda e caixa no mesmo sistema.',
  cta: 'Criar minha conta',
  secondary: 'Ver planos',
} as const

export const FOOTER_TAGLINE =
  'Sistema para barbearias, salões e profissionais da beleza — agenda, clientes e financeiro no dia a dia.'

export const FOOTER_CONTACT = {
  email: 'contato@glowup.com.br',
  emailHref: 'mailto:contato@glowup.com.br',
  hashtag: '#VemPraGlow',
} as const

/** @deprecated Mantido para compatibilidade — preferir SOCIAL_STATS */
export const LANDING_STATS = SOCIAL_STATS.map((s) => ({ valor: s.valor, rotulo: s.rotulo }))
