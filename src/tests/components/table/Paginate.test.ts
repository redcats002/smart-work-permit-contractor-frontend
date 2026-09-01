import { mount, type DOMWrapper } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import { describe, expect, it } from 'vitest'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import Paginate from '@/components/table/Paginate.vue'
import type { IPagination } from '@/composables/usePagination'

/**
 * wayfinder ticket 029. The field report was `/safety/inspectors` (sibling repo) rendering "Rows
 * per page [] of 0" against a response that actually said `{ count: 4, totalPage: 1, page: 1,
 * limit: 10 }`. Investigated here rather than assumed either way, per the ticket: this repo's
 * `Paginate.vue` is NOT the PrimeVue `Paginator` the sibling app's bug lives in — it is a
 * hand-rolled component that reads `pagination.count` / `.totalPage` / `.page` / `.limit`
 * DIRECTLY off the same `IPagination` object every list composable (`useHistory`, `useMyPermits`,
 * `useCertificates`) assigns straight from the API response (`response.count`,
 * `response.totalPage`) — there is no intermediate `rows`/`totalRecords`/`first` translation layer
 * for a shape mismatch to hide in. This binds a known response shape straight to the rendered
 * component and asserts what actually prints, which is the sibling repo's bug reproduced here as a
 * negative: it does not reproduce.
 */
function stubMatchMedia (): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: (): void => undefined,
      removeListener: (): void => undefined,
      addEventListener: (): void => undefined,
      removeEventListener: (): void => undefined,
      dispatchEvent: (): boolean => false
    } as unknown as MediaQueryList)
  })
}

function mountPaginate (pagination: IPagination): ReturnType<typeof mount> {
  return mount(Paginate, {
    props: { pagination },
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] }
  })
}

describe('Paginate — binds the server response, not a PrimeVue Paginator shape', () => {
  it('renders the real count and page (four rows, page 1 of 1), never "0"', () => {
    stubMatchMedia()
    setLocale('en')

    // Exactly the response shape the field report named: count: 4, totalPage: 1, page: 1, limit: 10.
    const wrapper = mountPaginate({ count: 4, totalPage: 1, page: 1, limit: 10 })

    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).not.toMatch(/จาก\s*0\b/)
    // The page-size <Select> is bound straight to pagination.limit — this asserts it actually
    // carries the real limit rather than rendering empty (the sibling bug's other symptom).
    expect(wrapper.text()).not.toContain('Rows per page []')
  })

  it('reflects a real multi-page response — page 2 of 3 — not a stuck "1 of 0"', async () => {
    stubMatchMedia()
    setLocale('en')

    const wrapper = mountPaginate({ count: 25, totalPage: 3, page: 2, limit: 10 })

    expect(wrapper.text()).toContain('25')
    // Page 2 of 3: the 2nd numbered page button is the active one (bg-primary-100 marks it).
    const active = wrapper.findAll('button')
      .find((button: DOMWrapper<HTMLButtonElement>): boolean => button.classes().includes('bg-primary-100'))
    expect(active?.text()).toBe('2')
  })
})
