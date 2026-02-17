import { createApp } from 'vue'
import App from './App.vue'
import registerPlugins from './plugins'

import '@/assets/css/main.css'

const app = registerPlugins(createApp(App))

app.mount('#app')
