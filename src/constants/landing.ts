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
  eyebrow: 'Barbearias, salões e profissionais autônomos',
  tituloLinha1: 'Agenda, clientes e caixa',
  tituloDestaque: 'organizados',
  tituloLinha2: 'para o seu negócio',
  subtitulo:
    'Configure sua agenda, receba agendamentos online e acompanhe o financeiro. Seus clientes criam conta na plataforma, escolhem profissional ou loja e marcam o horário.',
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
  titulo: 'Do profissional',
  destaque: 'ao salão com equipe',
  subtitulo:
    'A Glow atende quem trabalha sozinho e quem já tem vários profissionais na operação. O que muda é a profundidade das ferramentas, não a proposta.',
  oficios: ['Barbeiros', 'Cabeleireiros(as)', 'Barbearias', 'Salões'] as const,
} as const

export const AUDIENCE_PROFILES: readonly AudienceProfile[] = [
  {
    id: 'pequeno',
    step: '01',
    porte: 'Profissional autônomo',
    titulo: 'Quem atende sozinho',
    descricao:
      'Agenda no celular, histórico de quem agendou com você e controle do que entrou e saiu. Tudo no tamanho certo para quem não tem equipe.',
    pontos: [
      'Agenda e agendamentos online',
      'Link para o cliente marcar',
      'Financeiro sem planilha',
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
      'Vários profissionais, horários cruzados e comissão para fechar. A Glow centraliza agenda, acessos e caixa em um painel.',
    pontos: [
      'Agenda por profissional',
      'Comissões calculadas no sistema',
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
      'Alta ocupação e equipe grande pedem visão ampla. Acompanhe agenda, caixa e indicadores da operação inteira.',
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
  titulo: 'Conheça as telas',
  destaque: 'da plataforma',
  subtitulo:
    'Da agenda ao financeiro. Capturas reais do que você usa para organizar o dia a dia do negócio.',
} as const

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'dashboard',
    titulo: 'Painel do dia',
    beneficio:
      'Abriu o sistema e já sabe quantos atendimentos tem, como está a ocupação e o movimento do caixa.',
    mockup: 'dashboard',
  },
  {
    id: 'agenda',
    titulo: 'Agenda por profissional',
    beneficio:
      'Veja quem está livre, evite choque de horário e organize a cadeira de cada profissional.',
    mockup: 'agenda',
  },
  {
    id: 'clientes',
    titulo: 'Histórico de clientes',
    beneficio:
      'Veja quem já agendou com você: contato, serviços anteriores e preferências para retomar o atendimento.',
    mockup: 'clientes',
  },
  {
    id: 'financeiro',
    titulo: 'Financeiro do negócio',
    beneficio:
      'Registre entradas e saídas e veja o resultado do período sem montar planilha.',
    mockup: 'financeiro',
  },
  {
    id: 'comissao',
    titulo: 'Comissões',
    beneficio:
      'Defina a regra de cada profissional e acompanhe os valores antes de sentar para fechar o mês.',
    mockup: 'comissao',
    requerLojas: true,
  },
  {
    id: 'online',
    titulo: 'Agendamento online',
    beneficio:
      'O cliente cria conta, escolhe serviço, profissional e horário pelo celular. O horário cai direto na sua agenda.',
    mockup: 'online',
  },
  {
    id: 'equipe',
    titulo: 'Equipe e acessos',
    beneficio:
      'Cadastre profissionais, defina papéis e controle o que cada um pode ver e fazer no sistema.',
    mockup: 'equipe',
    requerLojas: true,
  },
  {
    id: 'explorar',
    titulo: 'Explorar lojas',
    beneficio:
      'Apareça no mapa para quem busca barbearias e salões na região e receba novos agendamentos.',
    mockup: 'explorar',
  },
  {
    id: 'servicos',
    titulo: 'Catálogo de serviços',
    beneficio:
      'Nome, preço, duração e status de cada serviço. O menu do negócio sempre atualizado.',
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
      'Seus clientes criam conta, escolhem serviço e horário pelo link. Você acompanha cada marcação na agenda.',
  },
  {
    step: '04',
    titulo: 'Acompanhe a operação',
    descricao:
      'Consulte agenda, caixa e indicadores conforme o dia avança. Você continua focado no atendimento.',
  },
]

export const FEATURES: FeatureItem[] = [
  {
    icon: 'agenda',
    titulo: 'Agenda unificada',
    descricao: 'Calendário com horários de todos os profissionais, legível no celular ou no computador.',
    beneficio: 'Menos conflito de horário e cadeira melhor aproveitada.',
  },
  {
    icon: 'online',
    titulo: 'Agendamento online',
    descricao: 'O cliente cria conta, escolhe serviço, profissional e horário pelo link da sua página.',
    beneficio: 'Horários preenchidos mesmo fora do expediente.',
  },
  {
    icon: 'clientes',
    titulo: 'Histórico de clientes',
    descricao: 'Contato e histórico de serviços de quem criou conta e agendou com você.',
    beneficio: 'Retorno mais fácil e atendimento com contexto.',
  },
  {
    icon: 'financeiro',
    titulo: 'Controle financeiro',
    descricao: 'Registro de movimentações e resultado do negócio por período.',
    beneficio: 'Caixa visível sem abrir várias planilhas.',
  },
  {
    icon: 'comissao',
    titulo: 'Comissões',
    descricao: 'Regras por profissional e serviço, calculadas a partir dos atendimentos.',
    beneficio: 'Fechamento transparente para dono e equipe.',
    requerLojas: true,
  },
  {
    icon: 'equipe',
    titulo: 'Gestão de equipe',
    descricao: 'Papéis, permissões e organização dos profissionais no mesmo painel.',
    beneficio: 'Operação maior sem perder controle de acessos.',
    requerLojas: true,
  },
  {
    icon: 'relatorios',
    titulo: 'Indicadores',
    descricao: 'Painéis com ocupação, faturamento e desempenho por período.',
    beneficio: 'Decisões com base no que aconteceu de fato no salão.',
  },
  {
    icon: 'notificacao',
    titulo: 'Lembretes',
    descricao: 'Confirmações automáticas enviadas ao cliente antes do horário.',
    beneficio: 'Menos buraco na agenda por falta.',
  },
]

export const BUSINESS_BENEFITS: BenefitItem[] = [
  {
    icon: 'agenda',
    titulo: 'Horários registrados',
    descricao:
      'Cada atendimento fica no sistema. Acabou anotar em papel, conversa ou planilha solta.',
  },
  {
    icon: 'notificacao',
    titulo: 'Menos faltas',
    descricao:
      'Lembretes e confirmações ajudam o cliente a comparecer no horário marcado.',
  },
  {
    icon: 'financeiro',
    titulo: 'Caixa visível',
    descricao:
      'Entradas, saídas e o que cada atendimento gerou, prontos quando você precisar consultar.',
  },
  {
    icon: 'equipe',
    titulo: 'Equipe alinhada',
    descricao:
      'Comissões e acessos definidos no sistema reduzem mal-entendido na operação.',
    requerLojas: true,
  },
  {
    icon: 'clientes',
    titulo: 'Cliente reconhecido',
    descricao:
      'Histórico e preferências de quem criou conta e agendou com você. Na próxima visita, você retoma de onde parou.',
  },
  {
    icon: 'relatorios',
    titulo: 'Visão do negócio',
    descricao:
      'Ocupação e movimento por período para planejar horários e capacidade da equipe.',
  },
  {
    icon: 'automacao',
    titulo: 'Menos retrabalho',
    descricao:
      'Agenda, clientes e caixa conectados. A mesma informação não precisa ser digitada duas vezes.',
  },
  {
    icon: 'dashboard',
    titulo: 'Dia sob controle',
    descricao:
      'Quem vem, quanto entrou e o que ainda falta fechar. Tudo no painel principal.',
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
      'Atendo sozinho e não precisava de um sistema de salão inteiro. A agenda e o financeiro cabem no meu dia, e o cliente marca sozinho.',
    rating: 5,
  },
  {
    nome: 'Camila Duarte',
    cargo: 'Médio negócio · Proprietária',
    estabelecimento: 'Salão Bela Arte',
    quote:
      'Com a equipe crescendo, perdemos horários no meio das conversas. Agora cada profissional tem agenda, comissão e o caixa fecha sem discussão.',
    rating: 5,
  },
  {
    nome: 'Rafael Mendes',
    cargo: 'Grande negócio · Sócio',
    estabelecimento: 'Barber House 97',
    quote:
      'Várias cadeiras, muita gente na operação. O painel unifica agenda, ocupação e resultado. Eu vejo o negócio inteiro, não só o dia.',
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
      'Sim. Existem planos para quem atende sozinho, com agenda, histórico de clientes, financeiro e agendamento online. Não precisa montar equipe.',
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
      'Sim. Eles criam conta na plataforma, escolhem serviço, profissional e horário. Você acompanha tudo na sua agenda.',
  },
  {
    pergunta: 'Preciso cadastrar meus clientes na plataforma?',
    resposta:
      'Não. Seus clientes criam a própria conta, escolhem serviço, profissional ou loja e fazem o agendamento online. Você acompanha o histórico de quem marcou com você.',
  },
  {
    pergunta: 'Como funcionam as comissões?',
    resposta:
      'Você define as regras. O sistema calcula com base nos atendimentos, para dono e equipe acompanharem os valores.',
    requerLojas: true,
  },
  {
    pergunta: 'Posso começar em um plano menor e mudar depois?',
    resposta:
      'Sim. Comece no plano que faz sentido hoje e mude quando a operação precisar de mais recursos.',
  },
  {
    pergunta: 'Tem suporte se eu travar na configuração?',
    resposta:
      'Sim. Fale com a equipe pelos canais de contato no rodapé ou consulte as respostas aqui no FAQ.',
  },
]

export const FINAL_CTA = {
  titulo: 'Comece a organizar',
  destaque: 'seu negócio hoje',
  subtitulo:
    'Crie sua conta, cadastre serviços e horários e comece a receber agendamentos. Seus clientes se cadastram e marcam online.',
  cta: 'Criar minha conta',
  secondary: 'Ver planos',
} as const

export const FOOTER_TAGLINE =
  'Gestão para barbearias, salões e profissionais da beleza. Agenda, clientes e financeiro no dia a dia.'

export const FOOTER_CONTACT = {
  email: 'contato@glowup.com.br',
  emailHref: 'mailto:contato@glowup.com.br',
  hashtag: '#VemPraGlow',
} as const

/** @deprecated Mantido para compatibilidade — preferir SOCIAL_STATS */
export const LANDING_STATS = SOCIAL_STATS.map((s) => ({ valor: s.valor, rotulo: s.rotulo }))
