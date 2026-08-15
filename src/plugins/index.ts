import type { App } from 'vue'
import i18n from './I18n.plugin'
import router from '../router'
import pinia from './Pinia.plugin'
import { registerPrimeVue } from './primevue.plugin'
import Sanitize from './sanitize.plugin'

export default function registerPlugins (app: App<Element>): App<Element> {
  const configured = app
    .use(router)
    .use(pinia)
    .use(i18n)
    .use(Sanitize)
  registerPrimeVue(configured)
  return configured
}
