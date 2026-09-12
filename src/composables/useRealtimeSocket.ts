import { onMounted, onUnmounted, watch } from 'vue'
import i18n from '@/plugins/I18n.plugin'
import { toast } from '@/plugins/toast'
import type { INotification } from '@/models/response/notification/NotificationRes.model'
import type { TRealtimeServerEvent } from '@/models/modules/realtime/Realtime.model'
import BadgeProvider, { type IBadgeProvider } from '@/resources/provider/badge/Badge.provider'
import { useAuthStore } from '@/stores/Auth'
import { useNotificationStore } from '@/stores/Notification'

/**
 * wayfinder 109. Fallback interval for `GET /v1/badges` while the realtime socket is not open —
 * a single named constant so the interval can only drift in one place, same convention as
 * `NOTIFICATION_POLL_INTERVAL_MS`.
 */
export const BADGE_POLL_INTERVAL_MS = 30000

const RECONNECT_BASE_DELAY_MS = 1000
const RECONNECT_MAX_DELAY_MS = 30000

/** The api closes the socket with this code on deactivation (wayfinder 109 API half). */
const ACCOUNT_DEACTIVATED_CLOSE_CODE = 4001

export interface IUseRealtimeSocket {
  start (): void
  stop (): void
}

const BadgeService: IBadgeProvider = new BadgeProvider()

let socket: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempts = 0
let pollTimer: ReturnType<typeof setInterval> | null = null
let intentionalClose = false

/**
 * `http`/`https` → `ws`/`wss`, same host and base the HTTP client already uses
 * (`VITE_APP_API_URL`) — first-party `WebSocket` only, no socket.io or other client library.
 */
function buildSocketUrl (): string {
  const apiUrl: string = import.meta.env.VITE_APP_API_URL ?? ''
  return `${apiUrl.replace(/^http/, 'ws')}/api/v1/realtime`
}

function stopPolling (): void {
  if (pollTimer === null) return
  clearInterval(pollTimer)
  pollTimer = null
}

async function pollBadgeCounts (): Promise<void> {
  try {
    const response = await BadgeService.getCounts()
    useNotificationStore().setUnreadCount(response.data.unreadNotifications)
  } catch (error) {
    console.error('[useRealtimeSocket] badge poll failed', error)
  }
}

function startPolling (): void {
  if (pollTimer !== null) return
  void pollBadgeCounts()
  pollTimer = setInterval((): void => {
    void pollBadgeCounts()
  }, BADGE_POLL_INTERVAL_MS)
}

// Pauses the fallback poll while the tab is not visible — resumes it immediately (not waiting for
// the next tick) the moment it is, but only when the socket is not already carrying live updates.
function onVisibilityChange (): void {
  if (socket !== null && socket.readyState === WebSocket.OPEN) return
  if (document.hidden) {
    stopPolling()
    return
  }
  startPolling()
}

function scheduleReconnect (): void {
  if (reconnectTimer !== null) return
  const capped = Math.min(RECONNECT_MAX_DELAY_MS, RECONNECT_BASE_DELAY_MS * 2 ** reconnectAttempts)
  const withJitter = capped * (0.5 + Math.random() * 0.5)
  reconnectAttempts += 1
  reconnectTimer = setTimeout((): void => {
    reconnectTimer = null
    connect()
  }, withJitter)
}

function handleMessage (raw: MessageEvent): void {
  let message: TRealtimeServerEvent
  try {
    message = JSON.parse(raw.data as string) as TRealtimeServerEvent
  } catch {
    console.error('[useRealtimeSocket] failed to parse message', raw.data)
    return
  }

  const notificationStore = useNotificationStore()

  switch (message.event) {
    case 'badge.counts':
      notificationStore.setUnreadCount(message.data.unreadNotifications)
      break
    case 'notification.created': {
      const notification: INotification = message.data
      notificationStore.prepend(notification)
      // The toast text is the notification's own `title` — exactly what the bell panel already
      // renders (AppTopbar.vue), never a backend `message` field. Ticket 007: this is not visible
      // on screen unless the panel happens to be open, so it toasts.
      toast.info(notification.title, i18n.global.t('platform.notifications.title'))
      break
    }
    default:
      // 109's own vocabulary is exactly these two events; anything else is ignored rather than
      // treated as a reason to tear down the connection.
      break
  }
}

function connect (): void {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) return
  if (socket !== null) return

  intentionalClose = false
  const ws = new WebSocket(buildSocketUrl())
  socket = ws

  ws.addEventListener('open', (): void => {
    reconnectAttempts = 0
    stopPolling()
  })

  ws.addEventListener('message', handleMessage)

  ws.addEventListener('close', (event: CloseEvent): void => {
    socket = null
    if (event.code === ACCOUNT_DEACTIVATED_CLOSE_CODE) {
      // Same treatment as the HTTP interceptor's 401 branch: the account is gone, so sign out and
      // send it back to login rather than trying to reconnect a socket that will be refused again.
      useAuthStore().logout()
      window.location.href = `${window.location.origin}/auth/login`
      return
    }
    if (intentionalClose) return
    startPolling()
    scheduleReconnect()
  })

  ws.addEventListener('error', (event: Event): void => {
    console.error('[useRealtimeSocket] socket error', event)
  })
}

function disconnect (): void {
  intentionalClose = true
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  reconnectAttempts = 0
  stopPolling()
  if (socket !== null) {
    socket.close()
    socket = null
  }
}

/**
 * The realtime socket for badges + notifications (wayfinder 109). Singleton module state — every
 * mount shares the same connection — connected while signed in, torn down on sign-out. While the
 * socket is not open (connecting, dropped, or never authenticated), `GET /v1/badges` is polled on
 * `BADGE_POLL_INTERVAL_MS` instead, so the badge count in `AppTopbar` never depends on which
 * transport is currently working.
 */
export function useRealtimeSocket (): IUseRealtimeSocket {
  const authStore = useAuthStore()

  function start (): void {
    connect()
    if (socket === null || socket.readyState !== WebSocket.OPEN) startPolling()
  }

  function stop (): void {
    disconnect()
  }

  watch(
    (): boolean => authStore.isAuthenticated, (isAuthenticated: boolean): void => {
      if (isAuthenticated) {
        start()
        return
      }
      stop()
    }, { immediate: true }
  )

  onMounted((): void => {
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onUnmounted((): void => {
    document.removeEventListener('visibilitychange', onVisibilityChange)
    stop()
  })

  return { start, stop }
}

export default useRealtimeSocket
