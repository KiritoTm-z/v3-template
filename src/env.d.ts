/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 更多环境变量...
  readonly VITE_APP_TITLE: string
  readonly VITE_MODE_DEV: boolean
  readonly VITE_MODE_PROD: boolean
  readonly VITE_API_PREFIX: string
  readonly VITE_PROXY_TARGET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
