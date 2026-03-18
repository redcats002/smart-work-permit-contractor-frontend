import type { App } from 'vue'
import { ToastService } from 'primevue'
import PrimeVue from 'primevue/config'
import router from '../router'
import pinia from './Pinia.plugin'
import { primeVueConfig as PrimeVueConfig } from './primevue.plugin'
import Sanitize from './sanitize.plugin'
import { registerToastService } from './toast'

export default function registerPlugins (app: App<Element>): App<Element> {
  const configured = app
    .use(router)
    .use(pinia)
    .use(PrimeVue, PrimeVueConfig)
    .use(ToastService)
    .use(Sanitize)
  registerToastService(configured)
  return configured
}
