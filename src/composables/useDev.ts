import { computed, type ComputedRef } from 'vue'

interface IUseDev {
  isDev: ComputedRef<boolean>
  isAlpha: ComputedRef<boolean>
  isStaging: ComputedRef<boolean>
  isProd: ComputedRef<boolean>
}

export default function useDev (): IUseDev {
  const isDev = computed((): boolean => {
    // const devEnvs = ['local', 'dev']
    const isLocalhost = window.location.hostname === 'localhost'
    // return import.meta.env.DEV || devEnvs.includes(import.meta.env.VITE_APP_ENV) || isLocalhost
    return isLocalhost
  })
  // The two vercel.app hostnames below kept the old brand on purpose. They are external
  // addresses, not labels — renaming the string here would not rename the deployment, it would
  // just stop matching. They are legacy besides: this app deploys to Cloudflare Pages now.
  const isAlpha = computed((): boolean => {
    const devEnvs = ['alpha']
    const isAlphaEnv = devEnvs.includes(import.meta.env.VITE_APP_ENV)
    const isAlphaHost = window.location.hostname === 'smart-work-permit-alpha.vercel.app'
    return isAlphaEnv || isAlphaHost
  })
  const isStaging = computed((): boolean => {
    const devEnvs = ['staging']
    const isStagingEnv = devEnvs.includes(import.meta.env.VITE_APP_ENV)
    const isStagingHost = window.location.hostname === 'smart-work-permit-staging.vercel.app'
    return isStagingEnv || isStagingHost
  })
  const isProd = computed((): boolean => {
    const prodEnvs = ['prod', 'production']
    const isProdEnv = prodEnvs.includes(import.meta.env.VITE_APP_ENV)
    const isProdHost = window.location.hostname === 'smart-work-permit.vercel.app'
    return isProdEnv || isProdHost
  })

  return { isDev, isAlpha, isStaging, isProd }
}
