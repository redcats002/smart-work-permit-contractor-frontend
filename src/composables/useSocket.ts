// composables/useSocket.ts
import { onBeforeMount, onUnmounted, ref, type Ref } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import { handleLoading } from '@/utils/HandleLoading'
import io, { type Socket } from 'socket.io-client'
import useResource from './useResource'

interface IUseSocket {
  socket: Ref<Socket | null>
  roomId: Ref<string | null>
  message: Ref<string>
  messages: Ref<string[]>
  isConnected: Ref<boolean>
  isRoomJoined: Ref<boolean>
  sendMessage(): void
  connect(): void
  disconnect(): void
  joinRoom (_branchId: number | null): void
  leaveRoom (): void
  on(event: string, callback: (data: any) => void): void
  off(event: string, callback?: (data: any) => void): void
  emit(event: string, data: any): void
}

interface IUseSocketOptions {
  initial?: boolean
}

const socket = ref<Socket | null>(null)
const roomId = ref<string | null>(null)
const isRoomJoined = ref<boolean>(false)
const isConnected = ref<boolean>(false)

export function useSocket (options: IUseSocketOptions = { initial: false }): IUseSocket {
  const authStore = useAuthStore()
  const resource = useResource()
  const url = resource.getRequestUrl('/v1/socket')

  const message = ref<string>('')
  const messages = ref<string[]>([])

  // * Join branch when init
  function joinRoom (_branchId: string | number | null): void {
    handleLoading((): void => {
      if (!_branchId) throw Error('Please enter a room ID')
      if (!isRoomJoined.value) { // Join only if not already joined
        roomId.value = _branchId?.toString()
        socket.value?.emit('joinRoom', _branchId)
        isRoomJoined.value = true
      }
    })
  }

  // * Leave branch when close
  function leaveRoom (): void {
    handleLoading((): void => {
      // if (!roomId.value) throw Error('You are not in a room')
      if (!roomId.value) return
      socket.value?.emit('leaveRoom', roomId.value)
      roomId.value = null // Clear the room ID after leaving
      isRoomJoined.value = false
    })
  }

  // * Method for debugged
  function sendMessage (): void {
    handleLoading((): void => {
      if (!roomId.value && !message.value) throw Error('Please enter a room and a message')
      socket.value?.emit('sendMessage', { message: message.value, room: `queue-room-${roomId.value}` })
      message.value = '' // Clear the message after sending
    })
  }

  // * Initialize the WebSocket connection
  function connect (): void {
    const VITE_APP_WEBSOCKET = import.meta.env.VITE_APP_WEBSOCKET
    const seconds = 10

    let newUrl = url
    if (newUrl.includes('alpha')) newUrl = newUrl.replace('/alpha', '')
    if (newUrl.includes('staging')) newUrl = newUrl.replace('/staging', '')

    if (!authStore.branch?.id) return // Join room is need branch id
    if (socket.value) return // Prevent multiple connections

    socket.value = io(newUrl, {
      path: `/${VITE_APP_WEBSOCKET}`,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000 * seconds
    })
    if (!socket.value.connected) socket.value.connect()
    isConnected.value = true
    // * For debugged
    on('sendMessage', (msg: string): void => {
      messages.value.push(msg)
    })

    on('connect', (): void => {
      joinRoom(authStore.branch?.id)
    })
    on('disconnect', (): void => {
      leaveRoom()
    })
  }

  // * Disconnect the WebSocket
  function disconnect (): void {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  // * Subscribe to a specific event
  function on (event: string, callback: (data: any) => void): void {
    if (!socket.value) return
    socket.value.on(event, callback)
  }

  // * Unsubscribe from a specific event
  function off (event: string, callback?: (data: any) => void): void {
    if (!socket.value) return
    socket.value.off(event, callback)
  }

  // * Emit an event to the server
  function emit (event: string, data: any): void {
    if (!socket.value) return
    socket.value.emit(event, data)
  }

  // * Initialize the connection when the composable is used
  onBeforeMount((): void => {
    if (!options?.initial) return
    disconnect()
    connect()
  })

  // * Clean up the connection when the app is destroyed
  onUnmounted((): void => {
    if (!options?.initial) return
    disconnect()
  })

  return {
    socket: socket as any,
    isConnected,
    isRoomJoined,
    message,
    messages,
    roomId,
    joinRoom,
    leaveRoom,
    sendMessage,
    on,
    off,
    emit,
    connect,
    disconnect
  }
}
