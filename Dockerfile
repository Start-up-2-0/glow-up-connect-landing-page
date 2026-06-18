# Build stage — Vite/Vue SSG
FROM node:20-alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_APP_NAME
ARG VITE_APP_URL
ARG VITE_SITE_URL
ARG VITE_WHATSAPP_NUMBER
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER

RUN npm run build

# Serve stage — Caddy
FROM caddy:2-alpine

WORKDIR /app

COPY Caddyfile caddy-entrypoint.sh ./
RUN caddy fmt Caddyfile --overwrite && chmod +x caddy-entrypoint.sh

COPY --from=build /app/dist ./dist

CMD ["/app/caddy-entrypoint.sh"]
