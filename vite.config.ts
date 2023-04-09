import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig(({ command, mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'types/auto-imports.d.ts'
      }),
      Components({
        resolvers: [],
        dirs: ['src/components'],
        // 组件名称包含目录，防止同名组件冲突
        directoryAsNamespace: true,
        dts: 'types/components.d.ts'
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE
          }
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      open: false,
      port: 3000,
      proxy: {
        '/api': {
          ws: true,
          target: env.VITE_PROXY_TARGET,
          // rewrite: (path) => path.replace(/^\/api/, '/api'),
          changeOrigin: true
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  }
})
