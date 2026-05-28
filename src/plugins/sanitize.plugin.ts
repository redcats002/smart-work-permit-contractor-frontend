import type { App } from 'vue'
import VueSanitize from 'vue-sanitize-directive'

export const sanitizeRichTextConfig = {
  // ...FILTER_BASIC,
  allowedAttributes: {
    // ...FILTER_BASIC.allowedAttributes,
    '*': ['style']
  },
  allowedStyles: {
    '*': {
      'color': [/^rgb\(\d+,\s*\d+,\s*\d+\)$/i, /^#[0-9a-fA-F]{3,6}$/i],
      'background-color': [/^rgb\(\d+,\s*\d+,\s*\d+\)$/i, /^#[0-9a-fA-F]{3,6}$/i],
      'text-align': [/^(left|right|center|justify)$/],
      'font-weight': [/^(bold|normal|\d+)$/],
      'font-style': [/^(italic|normal|oblique)$/],
      'text-decoration': [/^(underline|overline|line-through|none)$/]
    }
  }
}

export default {
  install (app: App<Element>): void {
    app.use(VueSanitize, {})
  }
}
