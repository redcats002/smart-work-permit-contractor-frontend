import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('I18n plugin', () => {
  beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('defaults to th when no locale is persisted', async () => {
    const { default: i18n } = await import('@/plugins/I18n.plugin')
    expect(i18n.global.locale.value).toBe('th')
  })

  it('restores a persisted locale on init', async () => {
    const { LOCALE_STORAGE_KEY } = await import('@/plugins/I18n.plugin')
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')

    vi.resetModules()
    const { default: i18n } = await import('@/plugins/I18n.plugin')
    expect(i18n.global.locale.value).toBe('en')
  })

  it('falls back to th when the persisted value is not a supported locale', async () => {
    const { LOCALE_STORAGE_KEY } = await import('@/plugins/I18n.plugin')
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr')

    vi.resetModules()
    const { default: i18n } = await import('@/plugins/I18n.plugin')
    expect(i18n.global.locale.value).toBe('th')
  })

  it('setLocale switches the active locale and persists the choice to localStorage', async () => {
    const { default: i18n, setLocale, LOCALE_STORAGE_KEY } = await import('@/plugins/I18n.plugin')

    expect(i18n.global.locale.value).toBe('th')
    setLocale('en')

    expect(i18n.global.locale.value).toBe('en')
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en')
  })

  it('getPersistedLocale reads the stored value without mounting the app', async () => {
    const { getPersistedLocale, LOCALE_STORAGE_KEY } = await import('@/plugins/I18n.plugin')
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    expect(getPersistedLocale()).toBe('en')
  })

  it('exposes both en and th message trees with matching key shape', async () => {
    const { default: i18n } = await import('@/plugins/I18n.plugin')
    const en = i18n.global.getLocaleMessage('en')
    const th = i18n.global.getLocaleMessage('th')
    expect(Object.keys(en)).toEqual(Object.keys(th))
  })

  it('resolves nested keys — including numeric wizard-step keys — through t()', async () => {
    const { default: i18n, setLocale } = await import('@/plugins/I18n.plugin')

    expect(i18n.global.t('permit.wizard.step.1')).toBe('เลือกประเภทงาน')
    expect(i18n.global.t('permit.status.FIRE_MONITOR')).toBe('ตรวจตราไฟ')
    expect(i18n.global.t('permit.type.hot')).toBe('งานที่มีความร้อน / ประกายไฟ')

    setLocale('en')
    expect(i18n.global.t('permit.wizard.step.4')).toBe('PPE & Workers')
    expect(i18n.global.t('platform.nav.newPermit')).toBe('New Permit')
  })
})
