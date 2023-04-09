import type { App } from 'vue'
import { createPinia } from 'pinia'

export default function setupPinia(app: App) {
  const pinia = createPinia()
  app.use(pinia)
}
