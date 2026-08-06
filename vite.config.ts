import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget = env.VITE_API_PROXY_TARGET?.trim() || 'http://localhost:5127'
  const glowProxySecret = env.GLOW_PROXY_SECRET?.trim()
  const siteUrl = env.VITE_SITE_URL?.trim() || 'https://glowupconnect.com.br'

  return {
    plugins: [
      vue(),
      Sitemap({
        hostname: siteUrl.replace(/\/+$/, ''),
        dynamicRoutes: ['/termos-de-uso', '/politica-de-cookies', '/explorar-lojas'],
        changefreq: 'weekly',
        priority: 0.8,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router') || id.includes('node_modules/pinia')) {
              return 'vue-vendor'
            }
          },
        },
      },
    },
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      includedRoutes: () => ['/', '/termos-de-uso', '/politica-de-cookies', '/explorar-lojas'],
    },
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          configure: (proxy) => {
            if (!glowProxySecret) return
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('X-Glow-Proxy-Secret', glowProxySecret)
            })
          },
        },
        '/health': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
