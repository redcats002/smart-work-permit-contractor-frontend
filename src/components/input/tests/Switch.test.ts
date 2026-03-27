import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
vi.mock('@iconify/vue', () => ({
  Icon: {
    template: '<i :data-icon="icon" data-testid="switch-icon" />',
    props: ['icon']
  }
}))

import Switch from '../Switch.vue'

describe('Switch.vue', () => {
  const labelSelector = '[data-testid="switch-label"]'
  const toggleSelector = '[data-testid="toggle-switch"] input[type="checkbox"]'

  it('renders the false label by default and the true label when checked', async () => {
    const wrapper = mount(Switch, {
      props: {
        trueLabel: 'ใช้งาน',
        falseLabel: 'ปิดใช้งาน',
        modelValue: false
      }
    })

    expect(wrapper.get(labelSelector).text()).toBe('ปิดใช้งาน')

    await wrapper.setProps({ modelValue: true })

    expect(wrapper.get(labelSelector).text()).toBe('ใช้งาน')
  })

  it('emits update:modelValue when toggled', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false
      }
    })

    await wrapper.get(toggleSelector).setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('does not render the label when no labels are provided', () => {
    const wrapper = mount(Switch)

    expect(wrapper.find(labelSelector).exists()).toBe(false)
  })

  it('renders the handle icon based on the checked state', async () => {
    const wrapper = mount(Switch, {
      props: {
        handle: true,
        modelValue: false
      }
    })

    expect(wrapper.get('[data-testid="switch-icon"]').attributes('data-icon')).toBe('ph:x-bold')

    await wrapper.setProps({ modelValue: true })

    expect(wrapper.get('[data-testid="switch-icon"]').attributes('data-icon')).toBe('ph:check-bold')
  })

  it('does not emit updates when readonly is enabled', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
        readonly: true
      }
    })

    await wrapper.get(toggleSelector).setValue(true)

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
