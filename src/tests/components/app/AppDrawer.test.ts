import { mount, type DOMWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import AppDrawer from '@/components/app/AppDrawer.vue'

/**
 * wayfinder 110 — the contractor menu shrinks: "Create permit" and "History" are cut, "Getting
 * started" moves to the app bar, and "Certificates"/"Workers" move under a new non-navigable
 * "Personnel" group. This is the drawer's own shape test — `PermitListPage.history.test.ts` and
 * `AppTopbar` cover where the cut items' functionality actually went.
 */
function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits', name: 'PermitListPage', component: { template: '<div />' } },
      { path: '/permits/create', name: 'PermitCreatePage', component: { template: '<div />' } },
      { path: '/certificates', name: 'CertificateListPage', component: { template: '<div />' } },
      { path: '/workers', name: 'WorkerListPage', component: { template: '<div />' } },
      { path: '/profile', name: 'ProfileDetailPage', component: { template: '<div />' } }
    ]
  })
}

async function mountDrawer (path: string): Promise<ReturnType<typeof mount>> {
  const router = buildRouter()
  await router.push(path)
  await router.isReady()

  return mount(AppDrawer, {
    global: {
      plugins: [i18n, router, [PrimeVue, { unstyled: true }]]
    }
  })
}

describe('AppDrawer (wayfinder 110)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
  })

  it('renders Permits and a Personnel group holding Certificates and Workers — nothing else', async () => {
    const wrapper = await mountDrawer('/permits')

    expect(wrapper.text()).toContain('My Permits')
    expect(wrapper.text()).toContain('Personnel')
    expect(wrapper.text()).toContain('Certificates')
    expect(wrapper.text()).toContain('Workers')

    // Cut from the menu entirely (folded into Permits, or moved to the app bar).
    expect(wrapper.text()).not.toContain('History')
    expect(wrapper.text()).not.toContain('Getting started')
    // "New Permit" was the old Create-permit nav label — PermitListPage's own + button is the
    // only door now.
    expect(wrapper.text()).not.toContain('New Permit')
  })

  it('links Personnel\'s children straight to their routes, not to a /personnel page nobody asked for', async () => {
    const wrapper = await mountDrawer('/permits')

    const links = wrapper.findAll('a').map((link: DOMWrapper<HTMLAnchorElement>): string | undefined => link.attributes('href'))
    expect(links).toContain('/certificates')
    expect(links).toContain('/workers')
    expect(links).not.toContain('/personnel')
  })

  it('still highlights Permits while on the create wizard, now that "Create permit" has no separate entry', async () => {
    const wrapper = await mountDrawer('/permits/create')

    const permitsLink = wrapper.findAll('a').find((link: DOMWrapper<HTMLAnchorElement>): boolean => link.attributes('href') === '/permits')
    expect(permitsLink?.classes()).toContain('bg-(--color-shell-sidebar-active)')
  })
})
