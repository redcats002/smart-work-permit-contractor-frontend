import '@/assets/css/main.css'
import { createApp } from 'vue'
import { checkEnv } from '@/utils/EnvChecker'
import App from './App.vue'
import registerPlugins from './plugins'

checkEnv()

const app = registerPlugins(createApp(App))

app.mount('#app')
