import type { App } from 'vue'
import VueSanitize from 'vue-sanitize-directive'

export default {
  install (app: App<Element>): void {
    app.use(VueSanitize, {})
  }
}
