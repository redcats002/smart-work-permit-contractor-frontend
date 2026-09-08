import type { App } from 'vue'
import i18n from './I18n.plugin'
import router from '../router'
import pinia from './Pinia.plugin'
import { registerIcons } from './Icon.plugin'
import { registerPrimeVue } from './primevue.plugin'
import Sanitize from './sanitize.plugin'

export default function registerPlugins (app: App<Element>): App<Element> {
  // wayfinder 041 — side-effect call, not app.use(): bundled icon data has no Vue plugin
  // surface, it just needs to be registered with @iconify/vue/offline's module-level storage
  // before anything renders an <AppIcon>.
  registerIcons()
  const configured = app
    .use(router)
    .use(pinia)
    .use(i18n)
    .use(Sanitize)
  registerPrimeVue(configured)
  return configured
}
