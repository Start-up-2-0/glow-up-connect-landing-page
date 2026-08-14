export const LANDING_SECTIONS = {
  inicio: 'inicio',
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
  eyebrow: 'Feito para o seu negócio',
  tituloLinha1: 'Organize a operação',
  tituloDestaque: 'do dia a dia',
  tituloLinha2: 'em um só lugar',
  subtitulo:
    'Agenda, clientes, financeiro e equipe — do agendamento ao caixa, sem planilha e sem improviso.',
  ctaPrimario: 'Começar agora',
  ctaSecundario: 'Ver na prática',
} as const

export const SHOWCASE_INTRO = {
  eyebrow: 'Na prática',
  titulo: 'Veja a operação',
  destaque: 'funcionando',
  subtitulo:
    'Do agendamento ao caixa: telas pensadas para o ritmo real de barbearias e salões.',
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
      'Cadastre o estabelecimento em minutos. Sem instalação complexa — tudo na nuvem, pronto para usar.',
  },
  {
    step: '02',
    titulo: 'Configure o negócio',
    descricao:
      'Adicione serviços, profissionais, horários e preços. Em poucos passos sua operação já está no ar.',
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
      'Acompanhe caixa, comissões, equipe e indicadores — foque no atendimento enquanto o sistema cuida da gestão.',
  },
]

export const FEATURES: FeatureItem[] = [
  {
    icon: 'agenda',
    titulo: 'Agenda unificada',
    descricao: 'Visualize todos os horários da equipe em um calendário claro e responsivo.',
    beneficio: 'Menos conflitos de horário e cadeiras sempre bem aproveitadas.',
  },
  {
    icon: 'online',
    titulo: 'Booking online',
    descricao: 'Clientes agendam pelo celular, escolhendo serviço, profissional e horário.',
    beneficio: 'Agenda preenchida mesmo fora do horário comercial.',
  },
  {
    icon: 'clientes',
    titulo: 'CRM de clientes',
    descricao: 'Cadastro completo com histórico de serviços e preferências.',
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
  { valor: '2k+', rotulo: 'Profissionais conectados', hint: 'Barbearias e salões' },
  { valor: '96%', rotulo: 'Aprovação dos clientes', hint: 'Experiência que gera confiança' },
] as const

export const TESTIMONIALS: TestimonialItem[] = [
  {
    nome: 'Marina Souza',
    cargo: 'Proprietária',
    estabelecimento: 'Studio Aura Beauty',
    quote:
      'Antes a agenda era um caos de mensagens. Com o Glow Up Connect, a equipe sabe exatamente o que fazer — e o caixa fechou com muito mais clareza.',
    rating: 5,
  },
  {
    nome: 'Rafael Mendes',
    cargo: 'Sócio',
    estabelecimento: 'Barber House 97',
    quote:
      'As comissões deixaram de ser briga no fim do mês. Os profissionais confiam nos números e eu confio na operação.',
    rating: 5,
  },
  {
    nome: 'Camila Duarte',
    cargo: 'Gerente',
    estabelecimento: 'Salão Bela Arte',
    quote:
      'O agendamento online preencheu horários que antes ficavam vazios. Parece que o salão trabalha mesmo quando estamos fechados.',
    rating: 5,
  },
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    pergunta: 'O Glow Up Connect é só para barbearias e salões?',
    resposta:
      'Sim. A plataforma foi feita para barbearias e salões — com equipe ou como profissional autônomo — com agenda, financeiro e presença digital no mesmo lugar.',
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
      'Sim. Escolha o plano adequado ao momento do negócio e evolua conforme a operação cresce. Sem burocracia desnecessária.',
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
    'Cadastre-se, configure em poucos passos e comece a atender com agenda, caixa e equipe no mesmo lugar.',
  cta: 'Criar minha conta',
  secondary: 'Ver planos',
} as const

export const FOOTER_TAGLINE =
  'Gestão para barbearias e salões — do agendamento ao caixa, com a operação sob controle.'

export const FOOTER_CONTACT = {
  email: 'contato@glowup.com.br',
  phone: '(79) 9 9999-9999',
  phoneHref: 'tel:+5579999999999',
  emailHref: 'mailto:contato@glowup.com.br',
  hashtag: '#VemPraGlow',
} as const

/** @deprecated Mantido para compatibilidade — preferir SOCIAL_STATS */
export const LANDING_STATS = SOCIAL_STATS.map((s) => ({ valor: s.valor, rotulo: s.rotulo }))
