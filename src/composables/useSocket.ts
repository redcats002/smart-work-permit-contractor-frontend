import { onBeforeMount, onUnmounted, ref, type Ref } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import type { TAnnouncementSocketEvent, TWorkSocketEvent } from '@/stores/Notification'

export type TSocketBasic = 'connect' | 'disconnect'
export type TSocketEvent = TWorkSocketEvent | TAnnouncementSocketEvent | TSocketBasic

export interface ISocketMessage {
  event: TSocketEvent
  data: ISocketData
  timestamp: string
}
export interface ISocketData {
  id: number
}

interface IUseSocket {
  socket: Ref<WebSocket | null>
  roomId: Ref<string | null>
  // message: Ref<string>
  // messages: Ref<string[]>
  isConnected: Ref<boolean>
  isRoomJoined: Ref<boolean>
  // sendMessage(): void
  connect(): void
  disconnect(): void
  // joinRoom (_branchId: number | null): void
  // leaveRoom (): void
  on(event: string, callback: (data: any) => void): void
  off(event: string, callback?: (data: any) => void): void
  emit(event: string, data: any): void
}

interface IUseSocketOptions {
  initial?: boolean
}

const socket = ref<WebSocket | null>(null)
const roomId = ref<string | null>(null)
const isRoomJoined = ref<boolean>(false)
const isConnected = ref<boolean>(false)

const eventListeners = new Map<string, Set<(data: any) => void>>()
let reconnectCount = 0
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let intentionalDisconnect = false

const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY_MS = 10_000

function buildWsUrl (): string {
  const apiUrl: string = import.meta.env.VITE_APP_API_URL ?? 'http://localhost:3000'
  const wsPath: string = import.meta.env.VITE_APP_WEBSOCKET ?? 'ws'
  const base = apiUrl
  const result = `${base.replace(/^http/, 'ws')}/${wsPath}`
  return result
}

function dispatchEvent (event: TSocketEvent, data: ISocketData | null): void {
  eventListeners.get(event)?.forEach((cb: (data: any) => void): void => {
    cb(data)
  })
}

export function useSocket (options: IUseSocketOptions = { initial: false }): IUseSocket {
  const authStore = useAuthStore()

  // const message = ref<string>('')
  // const messages = ref<string[]>([])

  // function joinRoom (_branchId: string | number | null): void {
  //   handleLoading((): void => {
  //     if (!_branchId) throw Error('Please enter a room ID')
  //     if (!isRoomJoined.value) {
  //       roomId.value = _branchId?.toString()
  //       emit('joinRoom', _branchId)
  //       isRoomJoined.value = true
  //     }
  //   })
  // }

  // function leaveRoom (): void {
  //   handleLoading((): void => {
  //     if (!roomId.value) return
  //     emit('leaveRoom', roomId.value)
  //     roomId.value = null
  //     isRoomJoined.value = false
  //   })
  // }

  // function sendMessage (): void {
  //   handleLoading((): void => {
  //     if (!roomId.value && !message.value) throw Error('Please enter a room and a message')
  //     emit('sendMessage', { message: message.value, room: `queue-room-${roomId.value}` })
  //     message.value = ''
  //   })
  // }

  function on (event: string, callback: (data: any) => void): void {
    if (!eventListeners.has(event)) eventListeners.set(event, new Set())
    eventListeners.get(event)!.add(callback)
  }

  function off (event: string, callback?: (data: any) => void): void {
    if (!eventListeners.has(event)) return
    if (callback) {
      eventListeners.get(event)!.delete(callback)
    } else {
      eventListeners.delete(event)
    }
  }

  function emit (event: string, data: any): void {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) return
    socket.value.send(JSON.stringify({ event, data }))
  }

  function scheduleReconnect (): void {
    if (reconnectCount >= MAX_RECONNECT_ATTEMPTS) return
    reconnectCount++
    reconnectTimer = setTimeout((): void => {
      connect()
    }, RECONNECT_DELAY_MS)
  }

  function connect (): void {
    if (!authStore.branch?.id) return
    if (socket.value) return
    intentionalDisconnect = false
    const ws = new WebSocket(buildWsUrl())
    socket.value = ws


    ws.addEventListener('open', (): void => {
      isConnected.value = true
      reconnectCount = 0
      // joinRoom(authStore.branch?.id ?? null)
      dispatchEvent('connect', null)
    })

    ws.addEventListener('close', (): void => {
      socket.value = null
      isConnected.value = false
      roomId.value = null
      isRoomJoined.value = false
      dispatchEvent('disconnect', null)
      if (!intentionalDisconnect) scheduleReconnect()
    })

    ws.addEventListener('message', (event: MessageEvent): void => {
      try {
        const { event: name, data } = JSON.parse(event.data as string) as ISocketMessage
        console.log(name, data)
        dispatchEvent(name, data)
      } catch {
        console.error('[useSocket] Failed to parse message', event.data)
      }
    })

    ws.addEventListener('error', (event: Event): void => {
      console.error('[useSocket] WebSocket error', event)
    })
  }

  function disconnect (): void {
    intentionalDisconnect = true
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (socket.value) {
      // if (roomId.value && socket.value.readyState === WebSocket.OPEN) {
      //   socket.value.send(JSON.stringify({ event: 'leaveRoom', data: roomId.value }))
      // }
      socket.value.close()
      socket.value = null
      isConnected.value = false
      roomId.value = null
      isRoomJoined.value = false
    }
  }

  onBeforeMount((): void => {
    if (!options?.initial) return
    disconnect()
    connect()
  })

  onUnmounted((): void => {
    if (!options?.initial) return
    disconnect()
  })

  return {
    socket: socket as Ref<WebSocket | null>,
    isConnected,
    isRoomJoined,
    // message,
    // messages,
    roomId,
    // joinRoom,
    // leaveRoom,
    // sendMessage,
    on,
    off,
    emit,
    connect,
    disconnect
  }
}
