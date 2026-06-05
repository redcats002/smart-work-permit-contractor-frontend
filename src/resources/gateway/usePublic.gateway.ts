import { computed, type ComputedRef } from 'vue'
import { type IPublicGatewayResponse, type TPublicGatewayCallback } from '@/models/response/public/ResponsePublic.model'
import { useSocket } from '@/composables/useSocket'

interface IUsePublicGateway {
  isConnected: ComputedRef<boolean>
  initWatcher (): void
  destroyWatcher (): void
}


export default function usePublicGateway (callback?: TPublicGatewayCallback): IUsePublicGateway {
  const socket = useSocket()

  const isConnected = computed(() => socket.isConnected.value)

  function initWatcher (): void {
    socket?.on('public', async (e: IPublicGatewayResponse): Promise<void> => {
      console.info(`[Public Gateway] Received event:`, e)
      if (callback) await callback(e)
    })
  }

  function destroyWatcher (): void {
    socket.off('public')
  }

  return {
    isConnected,
    initWatcher,
    destroyWatcher
  }
}
