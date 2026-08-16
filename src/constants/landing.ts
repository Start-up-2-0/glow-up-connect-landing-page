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
}

export interface BenefitItem {
  titulo: string
  descricao: string
  icon: FeatureIconId
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
  { label: 'Explorar Lojas', id: LANDING_SECTIONS.explorarLojas, path: '/explorar-lojas' },
  { label: 'Planos', id: LANDING_SECTIONS.planos },
  { label: 'FAQ', id: LANDING_SECTIONS.faq },
] as const

export const HERO_COPY = {
  eyebrow: 'Para barbeiros, cabeleireiros e salões',
  tituloLinha1: 'Organize a operação',
  tituloDestaque: 'do dia a dia',
  tituloLinha2: 'em um só lugar',
  subtitulo:
    'Do profissional autônomo ao grande estabelecimento — agenda, clientes e financeiro para negócios pequenos, médios e grandes.',
  audiencia: ['Barbeiros', 'Cabeleireiros(as)', 'Pequenos', 'Médios', 'Grandes'] as const,
  portes: [
    { dt: 'Pequeno', dd: 'Autônomo' },
    { dt: 'Médio', dd: 'Equipe' },
    { dt: 'Grande', dd: 'Operação' },
  ] as const,
  ctaPrimario: 'Começar agora',
  ctaSecundario: 'Ver na prática',
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
  titulo: 'Do pequeno ao grande',
  destaque: 'o sistema cresce com você',
  subtitulo:
    'Atendemos barbeiros e cabeleireiros(as) autônomos — e barbearias e salões de todos os portes.',
  oficios: ['Barbeiros', 'Cabeleireiros(as)', 'Barbearias', 'Salões'] as const,
} as const

export const AUDIENCE_PROFILES: readonly AudienceProfile[] = [
  {
    id: 'pequeno',
    step: '01',
    porte: 'Pequeno negócio',
    titulo: 'Autônomos e operações enxutas',
    descricao:
      'Barbeiros e cabeleireiros(as) que atendem sozinhos. Agenda, clientes e caixa no celular — sem a complexidade de uma equipe.',
    pontos: [
      'Agenda e clientes no celular',
      'Agendamento online 24h',
      'Financeiro sem planilha',
    ],
    tipoAssinatura: 'ProfissionalAutonomo',
    cta: 'Ver planos para autônomos',
    icon: 'servicos',
  },
  {
    id: 'medio',
    step: '02',
    porte: 'Médio negócio',
    titulo: 'Barbearias e salões em crescimento',
    descricao:
      'Equipe pequena ou média, comissões e uma rotina que já não cabe no WhatsApp.',
    pontos: [
      'Agenda por profissional',
      'Comissões transparentes',
      'Papéis e permissões',
    ],
    tipoAssinatura: 'Estabelecimento',
    cta: 'Ver planos para o salão',
    icon: 'equipe',
  },
  {
    id: 'grande',
    step: '03',
    porte: 'Grande negócio',
    titulo: 'Operações com muitos profissionais',
    descricao:
      'Alta ocupação, vários atendentes e gestão centralizada — do agendamento ao caixa, em um só painel.',
    pontos: [
      'Visão unificada da operação',
      'Indicadores e ocupação',
      'Controle de acessos e caixa',
    ],
    tipoAssinatura: 'Estabelecimento',
    cta: 'Ver planos para a operação',
    icon: 'dashboard',
  },
]

export const SHOWCASE_INTRO = {
  eyebrow: 'Na prática',
  titulo: 'Veja a operação',
  destaque: 'funcionando',
  subtitulo:
    'Do agendamento ao caixa: telas pensadas para autônomos, barbearias e salões — do pequeno ao grande.'
} as const

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'dashboard',
    titulo: 'Dashboard operacional',
    beneficio:
      'Tenha visão imediata de atendimentos, faturamento e ocupação — sem planilhas e sem surpresas no fim do dia.',
    mockup: 'dashboard',
  },
  {
    id: 'agenda',
    titulo: 'Agenda inteligente',
    beneficio:
      'Organize horários por profissional, evite encaixes confusos e reduza ociosidade na cadeira.',
    mockup: 'agenda',
  },
  {
    id: 'clientes',
    titulo: 'Gestão de clientes',
    beneficio:
      'Histórico, preferências e retorno em um só lugar — fidelize quem já confia no seu atendimento.',
    mockup: 'clientes',
  },
  {
    id: 'financeiro',
    titulo: 'Financeiro do negócio',
    beneficio:
      'Acompanhe entradas, saídas e resultado com clareza para decidir com segurança.',
    mockup: 'financeiro',
  },
  {
    id: 'comissao',
    titulo: 'Comissão dos profissionais',
    beneficio:
      'Calcule e acompanhe comissões sem conflito — transparência que fortalece a equipe.',
    mockup: 'comissao',
  },
  {
    id: 'online',
    titulo: 'Agendamentos online',
    beneficio:
      'Seus clientes marcam horários 24h — menos WhatsApp perdido, mais agenda preenchida.',
    mockup: 'online',
  },
  {
    id: 'equipe',
    titulo: 'Gestão da equipe',
    beneficio:
      'Controle acessos, papéis e performance dos profissionais em um painel simples.',
    mockup: 'equipe',
  },
  {
    id: 'explorar',
    titulo: 'Explorar lojas',
    beneficio:
      'Apareça para novos clientes na região e atraia demanda qualificada para o seu salão ou barbearia.',
    mockup: 'explorar',
  },
  {
    id: 'servicos',
    titulo: 'Catálogo de serviços',
    beneficio:
      'Cadastre preços, duração e status dos serviços — o menu do estabelecimento sempre atualizado.',
    mockup: 'servicos',
  },
]

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: '01',
    titulo: 'Crie sua conta',
    descricao:
      'Cadastre-se em minutos como profissional autônomo ou com o estabelecimento. Sem instalação — tudo na nuvem.',
  },
  {
    step: '02',
    titulo: 'Configure o negócio',
    descricao:
      'Adicione serviços, horários e preços. Se tiver equipe, inclua os profissionais. Em poucos passos sua operação já está no ar.',
  },
  {
    step: '03',
    titulo: 'Receba agendamentos',
    descricao:
      'Clientes marcam online ou pela recepção. A agenda se organiza sozinha, com lembretes e confirmações.',
  },
  {
    step: '04',
    titulo: 'Gerencie o dia a dia',
    descricao:
      'Acompanhe caixa, agenda e indicadores — foque no atendimento enquanto o sistema cuida da gestão.',
  },
]

export const FEATURES: FeatureItem[] = [
  {
    icon: 'agenda',
    titulo: 'Agenda unificada',
    descricao: 'Visualize todos os horários em um calendário claro e responsivo.',
    beneficio: 'Menos conflitos de horário e cadeiras sempre bem aproveitadas.',
  },
  {
    icon: 'online',
    titulo: 'Agendamento online',
    descricao: 'Clientes agendam pelo celular, escolhendo serviço, profissional e horário.',
    beneficio: 'Agenda preenchida mesmo fora do horário comercial.',
  },
  {
    icon: 'clientes',
    titulo: 'Clientes',
    descricao: 'Histórico de serviços e preferências de cada cliente — tudo em um só lugar.',
    beneficio: 'Retorno mais frequente e atendimento personalizado.',
  },
  {
    icon: 'financeiro',
    titulo: 'Controle financeiro',
    descricao: 'Registre movimentações e acompanhe o resultado do estabelecimento.',
    beneficio: 'Clareza de caixa para crescer com segurança.',
  },
  {
    icon: 'comissao',
    titulo: 'Comissões automáticas',
    descricao: 'Regras de comissão por profissional e serviço, sem cálculo manual.',
    beneficio: 'Equipe motivada e fechamento sem discussão.',
  },
  {
    icon: 'equipe',
    titulo: 'Gestão de equipe',
    descricao: 'Permissões, desempenho e organização dos profissionais.',
    beneficio: 'Operação escalável sem perder o controle.',
  },
  {
    icon: 'relatorios',
    titulo: 'Indicadores em tempo real',
    descricao: 'Dashboards com ocupação, faturamento e performance.',
    beneficio: 'Decisões baseadas em números, não em achismo.',
  },
  {
    icon: 'notificacao',
    titulo: 'Lembretes e confirmações',
    descricao: 'Avisos automáticos que reduzem faltas e remarcações de última hora.',
    beneficio: 'Menos furos na agenda e mais previsibilidade.',
  },
]

export const BUSINESS_BENEFITS: BenefitItem[] = [
  {
    icon: 'agenda',
    titulo: 'Agenda organizada',
    descricao: 'Fim da confusão de papel, planilha e WhatsApp. Toda a operação em um fluxo único.',
  },
  {
    icon: 'notificacao',
    titulo: 'Menos faltas',
    descricao: 'Lembretes e confirmações reduzem no-shows e protegem o faturamento do dia.',
  },
  {
    icon: 'financeiro',
    titulo: 'Financeiro sob controle',
    descricao: 'Saiba quanto entra, quanto sai e quanto cada profissional gera — em tempo real.',
  },
  {
    icon: 'equipe',
    titulo: 'Equipe alinhada',
    descricao: 'Comissões transparentes e papéis claros aumentam confiança e produtividade.',
  },
  {
    icon: 'clientes',
    titulo: 'Clientes mais fiéis',
    descricao: 'Histórico e retorno facilitados transformam atendimento avulso em relacionamento.',
  },
  {
    icon: 'relatorios',
    titulo: 'Crescimento mensurável',
    descricao: 'Indicadores mostram onde investir tempo, marketing e capacidade da equipe.',
  },
  {
    icon: 'automacao',
    titulo: 'Processos automatizados',
    descricao: 'Menos tarefas manuais na recepção — mais tempo para o que importa: o cliente.',
  },
  {
    icon: 'dashboard',
    titulo: 'Produtividade diária',
    descricao: 'Painel único acelera a rotina e elimina retrabalho entre agenda, caixa e equipe.',
  },
]

export const SOCIAL_STATS = [
  { valor: '4k+', rotulo: 'Usuários na plataforma', hint: 'Em crescimento contínuo' },
  { valor: '12k+', rotulo: 'Agendamentos realizados', hint: 'Operação validada no dia a dia' },
  { valor: '2k+', rotulo: 'Profissionais conectados', hint: 'Pequenos, médios e grandes negócios' },
  { valor: '96%', rotulo: 'Aprovação dos clientes', hint: 'Experiência que gera confiança' },
] as const

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
    pergunta: 'Vocês atendem negócios pequenos, médios e grandes?',
    resposta:
      'Sim. Do barbeiro ou cabeleireiro autônomo ao grande salão com muitos profissionais: a plataforma se adapta ao porte — agenda, financeiro e presença digital no mesmo lugar.',
  },
  {
    pergunta: 'Sou barbeiro ou cabeleireiro autônomo. Consigo usar?',
    resposta:
      'Sim. Há planos específicos para profissionais autônomos — barbeiros e cabeleireiros(as) que atendem sozinhos — com agenda, clientes, financeiro e agendamento online, sem precisar montar uma equipe.',
  },
  {
    pergunta: 'O Glow Up Connect também serve barbearias e salões com equipe?',
    resposta:
      'Sim. Estabelecimentos médios e grandes usam agenda por profissional, comissões, permissões e indicadores da operação completa.',
  },
  {
    pergunta: 'Preciso instalar algum programa no computador?',
    resposta:
      'Não. O Glow Up Connect funciona no navegador, em computador ou celular. Basta acessar com sua conta e começar a configurar o estabelecimento.',
  },
  {
    pergunta: 'Consigo receber agendamentos online dos meus clientes?',
    resposta:
      'Sim. Seus clientes podem marcar horário escolhendo serviço e profissional, enquanto você acompanha tudo na agenda do estabelecimento.',
  },
  {
    pergunta: 'Como funcionam as comissões dos profissionais?',
    resposta:
      'Você define as regras de comissão e o sistema acompanha os valores com base nos atendimentos — com transparência para o dono e para a equipe.',
  },
  {
    pergunta: 'Posso começar com um plano menor e mudar depois?',
    resposta:
      'Sim. Comece no porte atual — autônomo, médio ou grande — e evolua o plano conforme a operação cresce. Sem burocracia desnecessária.',
  },
  {
    pergunta: 'Há suporte se eu tiver dúvidas na configuração?',
    resposta:
      'Sim. Nossa equipe está disponível para ajudar no onboarding e no uso diário. Você também encontra canais de contato no rodapé da página.',
  },
]

export const FINAL_CTA = {
  titulo: 'Pronto para colocar',
  destaque: 'a operação sob controle?',
  subtitulo:
    'Do autônomo ao grande salão: cadastre-se, configure em poucos passos e comece a atender com agenda e caixa no mesmo lugar.',
  cta: 'Criar minha conta',
  secondary: 'Ver planos',
} as const

export const FOOTER_TAGLINE =
  'Gestão para negócios de todos os portes — barbeiros, cabeleireiros e salões, do agendamento ao caixa.'

export const FOOTER_CONTACT = {
  email: 'contato@glowup.com.br',
  phone: '(79) 9 9999-9999',
  phoneHref: 'tel:+5579999999999',
  emailHref: 'mailto:contato@glowup.com.br',
  hashtag: '#VemPraGlow',
} as const

/** @deprecated Mantido para compatibilidade — preferir SOCIAL_STATS */
export const LANDING_STATS = SOCIAL_STATS.map((s) => ({ valor: s.valor, rotulo: s.rotulo }))
