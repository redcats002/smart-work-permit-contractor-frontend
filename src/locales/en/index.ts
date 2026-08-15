import certificate from '@/locales/en/certificate'
import common from '@/locales/en/common'
import error from '@/locales/en/error'
import history from '@/locales/en/history'
import permit from '@/locales/en/permit'
import platform from '@/locales/en/platform'

/**
 * English locale — the schema every other locale is typed against.
 *
 * One file per module namespace so concurrent work on different modules does not
 * collide in a single message file. Add a key to the namespace file, not here.
 */
const en = {
  platform,
  permit,
  history,
  certificate,
  common,
  error
}

export default en
