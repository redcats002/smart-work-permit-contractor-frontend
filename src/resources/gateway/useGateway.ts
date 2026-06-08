import { computed, type ComputedRef } from 'vue'
import { type ISocketData, type TSocketEvent, useSocket } from '@/composables/useSocket'

export interface IGatewayResponse extends ISocketData {
  type: TSocketEvent
}

interface IUsePublicGateway {
  isConnected: ComputedRef<boolean>
  initWatcher (): void
  destroyWatcher (): void
}

export default function useGateway<T> (name: string, callback?: (e: T) => void | Promise<void>): IUsePublicGateway {
  const socket = useSocket()

  const isConnected = computed(() => socket.isConnected.value)

  function initWatcher (): void {
    socket?.on(name, async (e: T): Promise<void> => {
      console.info(`[${name} Gateway] Received event:`, e)
      if (callback) await callback({
        ...e,
        type: name
      })
    })
  }

  function destroyWatcher (): void {
    socket.off(name)
  }

  return {
    isConnected,
    initWatcher,
    destroyWatcher
  }
}
