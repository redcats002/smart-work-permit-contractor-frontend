import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useAuthStore } from '@/stores/Auth'
import { useNotificationStore } from '@/stores/Notification'
import { BADGE_POLL_INTERVAL_MS, useRealtimeSocket } from '@/composables/useRealtimeSocket'
import BadgeProvider from '@/resources/provider/badge/Badge.provider'
import { toast } from '@/plugins/toast'
import type { TGetBadgeCountsResponse } from '@/models/response/badge/BadgeRes.model'
import type { INotification } from '@/models/response/notification/NotificationRes.model'

// `toast` wraps PrimeVue's ToastService, which a bare mount does not register (same convention as
// LoginPage.test.ts). Mocking it also makes the "toast text is the notification's own title, never
// a raw backend message" invariant assertable.
vi.mock('@/plugins/toast', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

// Comfortably above the reconnect ceiling (30s) so a scheduled reconnect would have fired by then.
const RECONNECT_UPPER_BOUND_MS = 60000

interface IFakeListener {
  (event: any): void
}

// A minimal, fully controllable stand-in for the browser's native WebSocket (no socket.io — the
// composable under test uses the native constructor directly). Real open/message/close/error
// dispatch is simulated explicitly from the test rather than driven by an actual connection.
class FakeWebSocket {
  public static readonly CONNECTING: number = 0

  public static readonly OPEN: number = 1

  public static readonly CLOSING: number = 2

  public static readonly CLOSED: number = 3

  public static instances: FakeWebSocket[] = []

  public url: string

  public readyState: number = FakeWebSocket.CONNECTING

  private listeners: Record<string, IFakeListener[]> = {}

  constructor (url: string) {
    this.url = url
    FakeWebSocket.instances.push(this)
  }

  public addEventListener (type: string, listener: IFakeListener): void {
    (this.listeners[type] ??= []).push(listener)
  }

  public removeEventListener (type: string, listener: IFakeListener): void {
    this.listeners[type] = (this.listeners[type] ?? []).filter((l: IFakeListener): boolean => l !== listener)
  }

  public close (code: number = 1000, reason: string = ''): void {
    this.readyState = FakeWebSocket.CLOSED
    this.dispatch('close', { code, reason })
  }

  // Test-only helpers, not part of the WebSocket surface.
  public serverOpen (): void {
    this.readyState = FakeWebSocket.OPEN
    this.dispatch('open', {})
  }

  public serverMessage (event: string, data: unknown): void {
    this.dispatch('message', { data: JSON.stringify({ event, data }) })
  }

  public serverClose (code: number): void {
    this.readyState = FakeWebSocket.CLOSED
    this.dispatch('close', { code, reason: '' })
  }

  private dispatch (type: string, event: any): void {
    for (const listener of this.listeners[type] ?? []) listener(event)
  }
}

const STUB_USER = {
  id: 'stub-contractor-1',
  name: 'Somchai Contractor',
  firstName: 'Somchai',
  lastName: 'Contractor',
  email: 'smoke.contractor@example.com',
  role: 'contractor' as const
}

function emptyBadgeCounts (unreadNotifications: number = 0): TGetBadgeCountsResponse {
  return { message: 'success', data: { unreadNotifications } }
}

function stubNotification (id: number): INotification {
  return {
    id,
    targetRole: 'contractor',
    targetUserId: STUB_USER.id,
    permitId: null,
    title: `Notification #${id}`,
    createdAt: new Date().toISOString(),
    read: false
  }
}

// Mounts the composable inside a real component instance — onMounted/onUnmounted require an
// active instance, and the auth-driven connect/disconnect watch is the behaviour under test.
function mountRealtime (): ReturnType<typeof mount> {
  const StubComponent = defineComponent({
    setup () {
      useRealtimeSocket()
      return (): ReturnType<typeof h> => h('div')
    }
  })
  return mount(StubComponent)
}

// The `watch(() => authStore.isAuthenticated, …)` inside the composable flushes on Vue's own
// scheduler, not synchronously with `userLogin`/`logout` — every test that changes auth state
// must await a tick before asserting on the connection it triggers.
async function login (): Promise<void> {
  useAuthStore().userLogin(STUB_USER, 'stub-access-token')
  await nextTick()
}

const env = import.meta.env as Record<string, string | undefined>

describe('useRealtimeSocket', () => {
  let wrapper: ReturnType<typeof mount> | null = null
  let originalApiUrl: string | undefined

  beforeEach(() => {
    const pinia = createPinia()
    createApp({}).use(pinia)
    setActivePinia(pinia)
    vi.useFakeTimers()
    vi.stubGlobal('WebSocket', FakeWebSocket)
    vi.stubGlobal('location', { pathname: '/', origin: 'http://localhost:8080', href: '' })
    FakeWebSocket.instances = []
    originalApiUrl = env.VITE_APP_API_URL
    env.VITE_APP_API_URL = 'http://localhost:3000'
    // Connecting always fires one immediate poll (see below) — mocked by default in every test,
    // not just the ones asserting on it, so no test can leak a real network call if a running
    // API happens to be reachable on this machine.
    vi.spyOn(BadgeProvider.prototype, 'getCounts').mockResolvedValue(emptyBadgeCounts())
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = null
    env.VITE_APP_API_URL = originalApiUrl
    vi.unstubAllGlobals()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('does not open a connection while signed out', () => {
    wrapper = mountRealtime()
    expect(FakeWebSocket.instances).toHaveLength(0)
  })

  it('connects after sign-in, deriving ws:// from the API base', async () => {
    wrapper = mountRealtime()
    await login()

    expect(FakeWebSocket.instances).toHaveLength(1)
    expect(FakeWebSocket.instances[0].url).toBe('ws://localhost:3000/api/v1/realtime')
  })

  it('updates the notification store badge count from a badge.counts frame', async () => {
    wrapper = mountRealtime()
    await login()
    const notificationStore = useNotificationStore()

    const socket = FakeWebSocket.instances[0]
    socket.serverOpen()
    socket.serverMessage('badge.counts', { unreadNotifications: 4 })

    expect(notificationStore.unreadCount).toBe(4)
  })

  it('prepends and toasts on a notification.created frame, using the notification\'s own title', async () => {
    wrapper = mountRealtime()
    await login()
    const notificationStore = useNotificationStore()

    const socket = FakeWebSocket.instances[0]
    socket.serverOpen()
    const notification = stubNotification(9)
    socket.serverMessage('notification.created', notification)

    expect(notificationStore.notifications[0]).toEqual(notification)
    expect(toast.info).toHaveBeenCalledWith(notification.title, expect.any(String))
  })

  it('falls back to polling GET /v1/badges once the socket closes', async () => {
    const getCountsSpy = vi.spyOn(BadgeProvider.prototype, 'getCounts').mockResolvedValue(emptyBadgeCounts(2))

    wrapper = mountRealtime()
    await login()
    const notificationStore = useNotificationStore()

    // Connecting fires one immediate poll so the badge has a real number before the socket opens
    // (per the ticket: never block the starting count on the connection succeeding).
    expect(getCountsSpy).toHaveBeenCalledTimes(1)

    const socket = FakeWebSocket.instances[0]
    socket.serverOpen()
    // While open, the socket carries live updates — no further poll fires.
    await vi.advanceTimersByTimeAsync(BADGE_POLL_INTERVAL_MS)
    expect(getCountsSpy).toHaveBeenCalledTimes(1)

    getCountsSpy.mockResolvedValue(emptyBadgeCounts(7))
    socket.serverClose(1006)
    await vi.advanceTimersByTimeAsync(0)

    expect(getCountsSpy).toHaveBeenCalledTimes(2)
    expect(notificationStore.unreadCount).toBe(7)
  })

  it('reconnects with capped exponential backoff after an unexpected close', async () => {
    // Math.random stubbed to 0 makes the jitter multiplier a fixed 0.5x, so each attempt's delay
    // is deterministic: 1000ms base → 500ms, then 2000ms base → 1000ms.
    vi.spyOn(Math, 'random').mockReturnValue(0)

    wrapper = mountRealtime()
    await login()

    const first = FakeWebSocket.instances[0]
    first.serverOpen()
    first.serverClose(1006)

    // Not yet reconnected at half the first attempt's own delay…
    await vi.advanceTimersByTimeAsync(250)
    expect(FakeWebSocket.instances).toHaveLength(1)
    // …but has by the full 500ms.
    await vi.advanceTimersByTimeAsync(250)
    expect(FakeWebSocket.instances).toHaveLength(2)

    const second = FakeWebSocket.instances[1]
    second.serverClose(1006)

    // Second attempt backs off further (1000ms) rather than retrying at the first attempt's own
    // 500ms delay — not yet reconnected at that point…
    await vi.advanceTimersByTimeAsync(500)
    expect(FakeWebSocket.instances).toHaveLength(2)
    // …but has by double that.
    await vi.advanceTimersByTimeAsync(500)
    expect(FakeWebSocket.instances).toHaveLength(3)
  })

  it('treats a 4001 close as signed out, same as the deactivated/401 handling', async () => {
    wrapper = mountRealtime()
    const authStore = useAuthStore()
    await login()

    const socket = FakeWebSocket.instances[0]
    socket.serverOpen()
    socket.serverClose(4001)
    await nextTick()

    expect(authStore.isAuthenticated).toBe(false)
    // No reconnect attempt is scheduled for a deactivation close.
    await vi.advanceTimersByTimeAsync(RECONNECT_UPPER_BOUND_MS)
    expect(FakeWebSocket.instances).toHaveLength(1)
  })

  it('tears the connection down and stops polling on sign-out', async () => {
    wrapper = mountRealtime()
    const authStore = useAuthStore()
    await login()

    const socket = FakeWebSocket.instances[0]
    socket.serverOpen()

    authStore.logout()
    await nextTick()

    expect(socket.readyState).toBe(FakeWebSocket.CLOSED)
  })
})
