import { computed, type ComputedRef } from 'vue'

interface IUseDev {
  isDev: ComputedRef<boolean>
}

export default function useDev (): IUseDev {
  const isDev = computed((): boolean => {
    // const devEnvs = ['local', 'dev']
    const isLocalhost = window.location.hostname === 'localhost'
    // return import.meta.env.DEV || devEnvs.includes(import.meta.env.VITE_APP_ENV) || isLocalhost
    return isLocalhost
  })
  return { isDev }
}
