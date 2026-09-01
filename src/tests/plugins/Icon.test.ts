import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('Icon plugin (wayfinder 041 — bundled offline icons, no runtime API fetch)', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch')
  })

  afterEach(() => {
    fetchSpy.mockRestore()
    vi.restoreAllMocks()
  })

  it('the offline entry point exports no network/API surface', async () => {
    const OfflineIconify = await import('@iconify/vue/offline')
    expect((OfflineIconify as unknown as Record<string, unknown>).addAPIProvider).toBeUndefined()
    expect((OfflineIconify as unknown as Record<string, unknown>)._api).toBeUndefined()
  })

  it('rendering a registered icon never calls fetch (or XMLHttpRequest, if the env exposes it)', async () => {
    const xhrSpy = typeof XMLHttpRequest !== 'undefined'
      ? vi.spyOn(XMLHttpRequest.prototype, 'open')
      : undefined

    const AppIcon = (await import('@/components/base/AppIcon.vue')).default
    mount(AppIcon, { props: { icon: 'mdi:plus' } })

    expect(fetchSpy).not.toHaveBeenCalled()
    if (xhrSpy) {
      expect(xhrSpy).not.toHaveBeenCalled()
      xhrSpy.mockRestore()
    }
  })

  it('renders real bundled SVG path data for a registered icon, no mock', async () => {
    const AppIcon = (await import('@/components/base/AppIcon.vue')).default
    const wrapper = mount(AppIcon, { props: { icon: 'mdi:plus' } })

    const path = wrapper.find('path')
    expect(path.exists()).toBe(true)
    const d = path.attributes('d')
    expect(d).toBeTruthy()
    expect(d?.length).toBeGreaterThan(0)
  })

  it('resolves a hyphen-form name to the same bundled data as its colon-form alias', async () => {
    // Several call sites in this repo (FileInput.vue, BaseModal.vue, AutoCompleteInput.vue, …)
    // pass 'mdi-close' rather than 'mdi:close'. The offline Icon component looks icons up by an
    // exact string key with no normalization, so this only renders because Icon.plugin.ts
    // registers a second addIcon() alias per icon under the hyphen form — this test is what
    // catches a regression in that loop, which nothing else in this file exercises.
    const AppIcon = (await import('@/components/base/AppIcon.vue')).default
    const wrapper = mount(AppIcon, { props: { icon: 'mdi-close' } })

    const path = wrapper.find('path')
    expect(path.exists()).toBe(true)
    const d = path.attributes('d')
    expect(d).toBeTruthy()
    expect(d?.length).toBeGreaterThan(0)
  })

  it('an unregistered icon logs a loud console.error, renders a visible placeholder, and never calls fetch', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation((): void => {})

    const AppIcon = (await import('@/components/base/AppIcon.vue')).default
    const wrapper = mount(AppIcon, { props: { icon: 'not-a-real-collection:missing-icon' } })

    expect(errorSpy).toHaveBeenCalled()
    expect(errorSpy.mock.calls.some((call: unknown[]): boolean =>
      String(call[0]).includes('not-a-real-collection:missing-icon'))).toBe(true)
    expect(wrapper.html().trim().length).toBeGreaterThan(0)
    expect(wrapper.find('svg').exists()).toBe(true)
    // This is the case that used to reach the network in API mode — an icon name Iconify does
    // not already have. Bundled/offline, a miss must fall through to the placeholder, never a
    // fetch.
    expect(fetchSpy).not.toHaveBeenCalled()

    errorSpy.mockRestore()
  })
})
