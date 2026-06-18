# Glow Up Connect — Landing Page

Site institucional da Glow Up Connect (`glowupconnect.com.br`), separado da aplicação principal em `app.glowupconnect.com.br`.

## Desenvolvimento

```bash
cp .env.example .env
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_BASE_URL` | Base da API (`/api` em produção) |
| `VITE_APP_URL` | URL do app para CTAs de assinatura |
| `VITE_SITE_URL` | URL canônica do site (SEO, sitemap) |
| `VITE_APP_NAME` | Nome da marca |
| `VITE_WHATSAPP_NUMBER` | Número do FAB WhatsApp |

## Deploy

Docker + Caddy com proxy `/api`, deploy via Railway (ver `.github/workflows/`).

### Cutover para produção

1. Deploy da landing em `glowupconnect.com.br` (serviço Railway dedicado).
2. Deploy do app com `VITE_LANDING_URL=https://glowupconnect.com.br`.
3. DNS: apex/www → landing; `app` → aplicação.
4. Backend: confirmar `FrontendBaseUrl` apontando para `https://app.glowupconnect.com.br`.
5. Google Search Console: verificar domínio e submeter `https://glowupconnect.com.br/sitemap.xml`.

### Checklist pós-deploy

- [ ] `/robots.txt` e `/sitemap.xml` respondem 200
- [ ] View-source da home mostra title, description, OG e JSON-LD
- [ ] CTAs de planos abrem `app.glowupconnect.com.br/onboarding/assinatura?planoId=`
- [ ] App `/` redireciona para login ou dashboard
- [ ] Links legais no cadastro abrem o domínio da landing
