import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import { describe, expect, it } from 'vitest'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import PasswordInput from '@/components/input/PasswordInput.vue'

/**
 * wayfinder ticket 028 — the show/hide toggle. Volt's `Password.vue` (src/volt/Password.vue,
 * never edited to fix a call site) renders the eye icon as a bare `@click` SVG with no `role`,
 * `tabindex` or keyboard handler — PrimeVue's own upstream default. `PasswordInput.vue`, the
 * app-owned wrapper every password field in this repo already goes through, overrides the two
 * icon slots to add a labelled, keyboard-operable toggle without touching the generated Volt file.
 */
describe('PasswordInput — show/hide toggle is labelled and keyboard-operable', () => {
  it('starts masked with a "Show password" control and toggles to plain text on click', async () => {
    setLocale('en')
    const wrapper = mount(PasswordInput, {
      props: { modelValue: 'secret123' },
      global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] }
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')

    const toggle = wrapper.find('[role="button"][aria-label="Show password"]')
    expect(toggle.exists()).toBe(true)
    expect(toggle.attributes('tabindex')).toBe('0')

    await toggle.trigger('click')

    expect(wrapper.find('input').attributes('type')).toBe('text')
    expect(wrapper.find('[role="button"][aria-label="Hide password"]').exists()).toBe(true)
  })

  it('toggles on Enter and Space, not only a mouse click', async () => {
    setLocale('en')
    const wrapper = mount(PasswordInput, {
      props: { modelValue: 'secret123' },
      global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] }
    })

    await wrapper.find('[role="button"]').trigger('keydown.enter')
    expect(wrapper.find('input').attributes('type')).toBe('text')

    await wrapper.find('[role="button"]').trigger('keydown.space')
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('carries the Thai label when the locale is Thai', () => {
    setLocale('th')
    const wrapper = mount(PasswordInput, {
      props: { modelValue: '' },
      global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] }
    })

    expect(wrapper.find('[role="button"][aria-label="แสดงรหัสผ่าน"]').exists()).toBe(true)
    setLocale('en')
  })
})
