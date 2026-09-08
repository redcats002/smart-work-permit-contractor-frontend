import type { TLocale } from '@/locales'
import messages, { LOCALES } from '@/locales'
import { createI18n } from 'vue-i18n'

/**
 * localStorage key the active locale is persisted under. Not routed through
 * src/utils/Storage.ts — that helper is cookie-backed (js-cookie) and shaped
 * for the persisted-Pinia access token; it does not fit a plain localStorage
 * string value, so the read/write lives here instead.
 */
export const LOCALE_STORAGE_KEY = 'smart-work-permit:locale'

const DEFAULT_LOCALE: TLocale = 'th'
const FALLBACK_LOCALE: TLocale = 'en'

function isLocale (value: string | null): value is TLocale {
  return value !== null && (LOCALES as string[]).includes(value)
}

/** Reads the persisted locale from localStorage, falling back to `th` if absent/invalid. */
export function getPersistedLocale (): TLocale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    return isLocale(stored) ? stored : DEFAULT_LOCALE
  } catch {
    // localStorage unavailable (private mode, disabled storage) — use the default
    return DEFAULT_LOCALE
  }
}

/** Persists the given locale to localStorage. Best-effort — never throws. */
export function persistLocale (locale: TLocale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // localStorage unavailable — locale stays in-memory only for this session
  }
}

/**
 * wayfinder ticket 030. `index.html`'s static `lang="th"` is only a pre-JS best guess (this app's
 * documented default locale) — a returning user who switched to English previously has `en`
 * persisted, and the document's `lang` must say so too, both on load (below) and on every runtime
 * switch (`setLocale`). Guarded for the same reason `getPersistedLocale`/`persistLocale` guard
 * `localStorage`: this module also runs under vitest/SSR-less test environments where `document`
 * exists but a stripped-down jsdom setup could still throw on an edge case — best-effort, never
 * throws.
 */
export function applyDocumentLocale (locale: TLocale): void {
  try {
    document.documentElement.lang = locale
  } catch {
    // no document (non-browser test environment) — nothing to update
  }
}

const i18n = createI18n({
  legacy: false,
  locale: getPersistedLocale(),
  fallbackLocale: FALLBACK_LOCALE,
  messages,
  datetimeFormats: {
    en: {
      short: { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Bangkok' },
      long: {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok'
      }
    },
    th: {
      short: { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Bangkok' },
      long: {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok'
      }
    }
  },
  numberFormats: {
    en: {
      decimal: { style: 'decimal' },
      // Gas/wind/height readings are shown to one decimal place in the design (e.g. LEL 0.0%).
      reading: { style: 'decimal', minimumFractionDigits: 1, maximumFractionDigits: 1 }
    },
    th: {
      decimal: { style: 'decimal' },
      reading: { style: 'decimal', minimumFractionDigits: 1, maximumFractionDigits: 1 }
    }
  }
})

/**
 * Switches the active locale at runtime and persists the choice.
 * Backend timestamps are always UTC; display formatting (`$d`) uses the
 * Asia/Bangkok datetimeFormats configured above regardless of active locale.
 */
export function setLocale (locale: TLocale): void {
  i18n.global.locale.value = locale
  persistLocale(locale)
  applyDocumentLocale(locale)
}

// Runs once at module load — matches document.documentElement.lang to whatever locale is
// actually active (persisted choice or the `th` default) as early as possible, rather than
// waiting for the first setLocale() call that may never come this session.
applyDocumentLocale(getPersistedLocale())

export default i18n
