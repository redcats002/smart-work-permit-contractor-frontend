import { ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import { handleSubmit } from '@/utils/HandleSubmit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/plugins/toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

const mockAddLoading = vi.fn()
const mockRemoveLoading = vi.fn()

vi.mock('@/stores/Loading', () => ({
  useLoadingStore: () => ({
    addLoading: mockAddLoading,
    removeLoading: mockRemoveLoading
  })
}))

vi.mock('@/utils/HandleSubmit', () => ({
  handleSubmit: vi.fn().mockResolvedValue(true)
}))

describe('handleLoading', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds and removes global loading around the callback', async () => {
    const callback = vi.fn().mockResolvedValue('result')

    await handleLoading(callback)

    expect(mockAddLoading).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledOnce()
    expect(mockRemoveLoading).toHaveBeenCalledOnce()
  })

  it('returns the callback result', async () => {
    const callback = vi.fn().mockResolvedValue(42)

    const result = await handleLoading(callback)

    expect(result).toBe(42)
  })

  it('calls errorCallBack and removes loading on error', async () => {
    const error = new Error('test error')
    const callback = vi.fn().mockRejectedValue(error)
    const errorCallBack = vi.fn()

    await handleLoading(callback, {}, errorCallBack)

    expect(errorCallBack).toHaveBeenCalledWith(error)
    expect(mockRemoveLoading).toHaveBeenCalledOnce()
  })

  it('uses loadingUnit ref instead of global store', async () => {
    const callback = vi.fn().mockResolvedValue(undefined)
    const loadingUnit = ref(false)

    await handleLoading(callback, { loadingUnit })

    expect(mockAddLoading).not.toHaveBeenCalled()
    expect(mockRemoveLoading).not.toHaveBeenCalled()
    expect(callback).toHaveBeenCalledOnce()
  })

  it('updates loadingUnit ref during execution', async () => {
    const states: boolean[] = []
    const loadingUnit = ref(false)

    const callback = vi.fn().mockImplementation(async () => {
      states.push(loadingUnit.value)
      return 'done'
    })

    await handleLoading(callback, { loadingUnit })

    expect(states[0]).toBe(true)
    expect(loadingUnit.value).toBe(false)
  })

  it('returns undefined and skips callback when formRef validation fails', async () => {
    vi.mocked(handleSubmit).mockResolvedValueOnce(false)
    const callback = vi.fn().mockResolvedValue('result')
    const formRef = ref({ validate: vi.fn() })

    const result = await handleLoading(callback, { formRef })

    expect(callback).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
    expect(mockRemoveLoading).toHaveBeenCalledOnce()
  })
})
