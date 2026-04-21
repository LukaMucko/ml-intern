import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function normalizeBasePath(value: string | undefined): string {
  if (!value || value === '/') return '/'
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

const base = normalizeBasePath(process.env.VITE_APP_BASE_PATH || process.env.APP_BASE_PATH)
const proxyBase = base === '/' ? '' : base.slice(0, -1)

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      [`${proxyBase}/api`]: {
        target: 'http://localhost:7860',
        changeOrigin: true,
        ws: true, // Proxy WebSocket connections (/api/ws/...)
        rewrite: (proxyPath) => proxyBase ? proxyPath.slice(proxyBase.length) : proxyPath,
      },
      [`${proxyBase}/auth`]: {
        target: 'http://localhost:7860',
        changeOrigin: true,
        rewrite: (proxyPath) => proxyBase ? proxyPath.slice(proxyBase.length) : proxyPath,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
