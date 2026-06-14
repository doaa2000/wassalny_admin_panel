import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { env } from '@/core/config/env'
import { useAuthStore } from '@/stores/auth.store'
import './assets/styles/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// In live (Supabase) mode, restore any persisted admin session before the first
// navigation so the auth guard has an accurate state. Mock mode needs no auth.
if (!env.useMock) {
  await useAuthStore().init()
}

app.mount('#app')
