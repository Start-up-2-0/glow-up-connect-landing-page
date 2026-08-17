export interface ConvitePreview {
  estabelecimentoId: number
  nomeEstabelecimento: string
  roleSugerida: string
  status: string
  limiteUsuarios: number
  quantidadeUtilizacoes: number
  vagasRestantes: number
  expiraEm: string
}

export interface ConviteAceito {
  id: number
  estabelecimentoId: number
  roleSugerida: string
  status: string
  limiteUsuarios: number
  quantidadeUtilizacoes: number
  expiraEm: string
  criadoEm: string
}

export interface AceitarConviteCadastroPayload {
  cadastro: {
    nome: string
    email: string
    telefone: string
    senha: string
    avatarBase64?: string
    avatarContentType?: string
  }
  nomePublico?: string
  foto?: string
  fotoContentType?: string
}
