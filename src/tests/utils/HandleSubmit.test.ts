import { ref } from 'vue'
import { handleSubmit, scrollToFirstError } from '@/utils/HandleSubmit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// HandleSubmit.ts uses window.document and document in a browser context.
// Stub them for the Node test environment.
const mockGetElementById = vi.fn().mockReturnValue(null)
vi.stubGlobal('window', { document: { getElementById: mockGetElementById } })

const mockQuerySelector = vi.fn()
vi.stubGlobal('document', { querySelector: mockQuerySelector })

// scrollToFirstError checks `firstElement instanceof HTMLElement`
vi.stubGlobal('HTMLElement', class {})

describe('handleSubmit', () => {
  it('returns true when formRef is undefined', async () => {
    const result = await handleSubmit(undefined)
    expect(result).toBe(true)
  })

  it('returns true when formRef.value is null', async () => {
    const formRef = ref(null)
    const result = await handleSubmit(formRef)
    expect(result).toBe(true)
  })

  it('returns true when formRef has no validate function', async () => {
    const formRef = ref({})
    const result = await handleSubmit(formRef)
    expect(result).toBe(true)
  })

  it('returns true when validation passes', async () => {
    const formRef = ref({
      validate: vi.fn().mockResolvedValue({ valid: true, errors: [] })
    })

    const result = await handleSubmit(formRef)
    expect(result).toBe(true)
    expect(formRef.value.validate).toHaveBeenCalledOnce()
  })

  it('returns false when validation fails', async () => {
    const formRef = ref({
      validate: vi.fn().mockResolvedValue({ valid: false, errors: [] })
    })

    const result = await handleSubmit(formRef)
    expect(result).toBe(false)
  })
})

describe('scrollToFirstError', () => {
  beforeEach(() => {
    mockQuerySelector.mockReset()
  })

  it('does nothing when errors is empty', () => {
    scrollToFirstError({})
    expect(mockQuerySelector).not.toHaveBeenCalled()
  })

  it('queries the first error element by name attribute', () => {
    const mockElement = {
      scrollIntoView: vi.fn(),
      focus: vi.fn()
    }
    mockQuerySelector.mockReturnValue(mockElement)

    scrollToFirstError({ name: [{ message: 'Required' }], other: [{ message: 'Also required' }] })

    expect(mockQuerySelector).toHaveBeenCalledWith(expect.stringContaining('[name="name"]'))
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    })
  })

  it('does not throw when the element is not found', () => {
    mockQuerySelector.mockReturnValue(null)
    expect(() => scrollToFirstError({ fieldName: [{ message: 'Error' }] })).not.toThrow()
  })
})
