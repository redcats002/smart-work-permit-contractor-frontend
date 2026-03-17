import { scrollToTop } from '@/utils/ScrollToTop'
import { describe, expect, it, vi } from 'vitest'

// Stub DOM globals for Node test environment
const mockQuerySelector = vi.fn()
const mockWindowScrollTo = vi.fn()

vi.stubGlobal('document', { querySelector: mockQuerySelector })
vi.stubGlobal('window', { scrollTo: mockWindowScrollTo })

describe('scrollToTop', () => {
  it('scrolls the app scroll container when it exists', () => {
    const scrollTo = vi.fn()
    mockQuerySelector.mockReturnValue({ scrollTo })

    scrollToTop()

    expect(mockQuerySelector).toHaveBeenCalledWith('[data-app-scroll="true"]')
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('falls back to window.scrollTo when container is not found', () => {
    mockQuerySelector.mockReturnValue(null)

    scrollToTop()

    expect(mockWindowScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('accepts a custom scroll behavior', () => {
    const scrollTo = vi.fn()
    mockQuerySelector.mockReturnValue({ scrollTo })

    scrollToTop('instant')

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
  })
})
