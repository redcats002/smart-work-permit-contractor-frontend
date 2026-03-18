import { useDebounce } from '@/utils/Debounce'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('delays execution by the specified delay', () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 300)

    debounced('a')
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(299)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledOnce()
    expect(fn).toHaveBeenCalledWith('a')
  })

  it('only calls the function once after rapid calls', () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 300)

    debounced('a')
    debounced('b')
    debounced('c')

    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledOnce()
    expect(fn).toHaveBeenCalledWith('c')
  })

  it('uses default delay of 1500ms', () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn)

    debounced()

    vi.advanceTimersByTime(1499)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledOnce()
  })

  describe('cancel', () => {
    it('prevents pending execution', () => {
      const fn = vi.fn()
      const debounced = useDebounce(fn, 300)

      debounced('a')
      debounced.cancel()

      vi.advanceTimersByTime(300)
      expect(fn).not.toHaveBeenCalled()
    })

    it('is a no-op when nothing is pending', () => {
      const fn = vi.fn()
      const debounced = useDebounce(fn, 300)

      expect(() => debounced.cancel()).not.toThrow()
    })
  })

  describe('flush', () => {
    it('immediately executes a pending call', () => {
      const fn = vi.fn()
      const debounced = useDebounce(fn, 300)

      debounced('a')
      debounced.flush()

      expect(fn).toHaveBeenCalledOnce()
      expect(fn).toHaveBeenCalledWith('a')
    })

    it('does nothing when nothing is pending', () => {
      const fn = vi.fn()
      const debounced = useDebounce(fn, 300)

      debounced.flush()
      expect(fn).not.toHaveBeenCalled()
    })

    it('prevents the timer from firing again after flush', () => {
      const fn = vi.fn()
      const debounced = useDebounce(fn, 300)

      debounced('a')
      debounced.flush()
      vi.advanceTimersByTime(300)

      expect(fn).toHaveBeenCalledOnce()
    })
  })
})
