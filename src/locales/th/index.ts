import type en from '@/locales/en'
import certificate from '@/locales/th/certificate'
import common from '@/locales/th/common'
import error from '@/locales/th/error'
import history from '@/locales/th/history'
import permit from '@/locales/th/permit'
import platform from '@/locales/th/platform'

/**
 * Thai locale — the app default.
 *
 * Typed against `en`, and each namespace file is typed against its English
 * counterpart, so a key added in English and missing in Thai is a type error at
 * the namespace file rather than a runtime fallback.
 */
const th: typeof en = {
  platform,
  permit,
  history,
  certificate,
  common,
  error
}

export default th
