import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import setupPlugins from './plugins/index'

import './assets/styles/index.scss'

async function bootstrap() {
  const app = createApp(App)

  setupPlugins(app)

  app.use(router)
  await router.isReady()
  app.mount('#app')
}
bootstrap()
