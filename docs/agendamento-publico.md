# Agendamento público (landing)

O wizard de agendamento público (loja + profissional via query) fica hospedado na **landing**:

`https://glowupconnect.com.br/loja/{publicGuid}/agendar?profissional={profissionalPublicGuid}`

## Rotas

| App | Destino |
|-----|---------|
| `/loja/:guid/agendar` | Redirect permanente para a landing (`VITE_LANDING_URL`) |
| Link copiado pelo profissional/dono | URL absoluta da landing |

## Fluxos do cliente na landing

1. **Visitante** — `POST /api/publico/agendar/loja/{guid}`
2. **Criar conta e agendar** — `POST .../com-cadastro`
3. **Entrar** — redirect para `app` com `?redirect=` de volta à URL da landing

## Variáveis

- Landing: `VITE_SITE_URL`, `VITE_APP_URL`
- App: `VITE_LANDING_URL`
