import type { App } from 'vue'
import router from '../router'
import pinia from './Pinia.plugin'
import { registerPrimeVue } from './primevue.plugin'
import Sanitize from './sanitize.plugin'

export default function registerPlugins (app: App<Element>): App<Element> {
  const configured = app
    .use(router)
    .use(pinia)
    .use(Sanitize)
  registerPrimeVue(configured)
  return configured
}
