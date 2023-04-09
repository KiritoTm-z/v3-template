import type { App } from 'vue'
import setupPinia from './pinia/index'

export default function setupPlugins(app: App) {
  setupPinia(app)
}
