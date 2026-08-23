import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useAuthStore } from '@/stores/Auth'
import { useNotificationStore } from '@/stores/Notification'
import { NOTIFICATION_POLL_INTERVAL_MS, useNotificationPolling } from '@/composables/useNotificationPolling'
import NotificationProvider from '@/resources/provider/notification/Notification.provider'
import type { TGetNotificationListResponse } from '@/models/response/notification/NotificationRes.model'

const STUB_USER = {
  id: 'stub-contractor-1',
  name: 'Somchai Contractor',
  firstName: 'Somchai',
  lastName: 'Contractor',
  email: 'smoke.contractor@example.com',
  role: 'contractor' as const
}

function emptyList (): TGetNotificationListResponse {
  return { message: 'success', data: [] }
}

// Mounts the composable inside a real component instance — onUnmounted requires an active
// instance, and the auth-driven start/stop watch is the behaviour under test, not the mount.
function mountPolling (): ReturnType<typeof mount> {
  const StubComponent = defineComponent({
    setup () {
      useNotificationPolling()
      return (): ReturnType<typeof h> => h('div')
    }
  })
  return mount(StubComponent)
}

describe('useNotificationPolling', () => {
  beforeEach(() => {
    const pinia = createPinia()
    createApp({}).use(pinia)
    setActivePinia(pinia)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('does not poll while unauthenticated', () => {
    const listSpy = vi.spyOn(NotificationProvider.prototype, 'list').mockResolvedValue(emptyList())

    mountPolling()
    vi.advanceTimersByTime(NOTIFICATION_POLL_INTERVAL_MS * 3)

    expect(listSpy).not.toHaveBeenCalled()
  })

  it('polls on the named interval once authenticated', async () => {
    const listSpy = vi.spyOn(NotificationProvider.prototype, 'list').mockResolvedValue(emptyList())
    const authStore = useAuthStore()
    authStore.userLogin(STUB_USER, 'stub-access-token')

    mountPolling()

    await vi.advanceTimersByTimeAsync(NOTIFICATION_POLL_INTERVAL_MS)
    expect(listSpy).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(NOTIFICATION_POLL_INTERVAL_MS)
    expect(listSpy).toHaveBeenCalledTimes(2)
  })

  it('stops polling and clears state the moment the store logs out', async () => {
    const listSpy = vi.spyOn(NotificationProvider.prototype, 'list').mockResolvedValue(emptyList())
    const authStore = useAuthStore()
    authStore.userLogin(STUB_USER, 'stub-access-token')

    mountPolling()
    const notificationStore = useNotificationStore()

    await vi.advanceTimersByTimeAsync(NOTIFICATION_POLL_INTERVAL_MS)
    expect(listSpy).toHaveBeenCalledTimes(1)

    authStore.logout()
    expect(notificationStore.notifications).toEqual([])

    await vi.advanceTimersByTimeAsync(NOTIFICATION_POLL_INTERVAL_MS * 3)
    expect(listSpy).toHaveBeenCalledTimes(1)
  })

  it('clears the interval on unmount', async () => {
    const listSpy = vi.spyOn(NotificationProvider.prototype, 'list').mockResolvedValue(emptyList())
    const authStore = useAuthStore()
    authStore.userLogin(STUB_USER, 'stub-access-token')

    const wrapper = mountPolling()
    await vi.advanceTimersByTimeAsync(NOTIFICATION_POLL_INTERVAL_MS)
    expect(listSpy).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    await vi.advanceTimersByTimeAsync(NOTIFICATION_POLL_INTERVAL_MS * 3)
    expect(listSpy).toHaveBeenCalledTimes(1)
  })
})
