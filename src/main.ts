import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { initDatabase } from './services/database'

async function bootstrap() {
  await initDatabase()
  createApp(App).mount('#app')
}

bootstrap()
