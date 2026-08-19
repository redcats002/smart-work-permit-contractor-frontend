import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/Auth'

// No key conversion happens here, in either direction (API-002). The backend is camelCase both
// ways — see docs/main/dev-handoff/04-api-contract.md. Converting would be worse than redundant:
// `closureChecklist` is a free-form key/value object round-tripped verbatim, and camelizing it
// silently rewrites user data. The request-side decamelize that used to sit here commented out
// would have renamed `workTimeStart` to `work_time_start` and broken every write.

export function onRequest (config: AxiosRequestConfig): AxiosRequestConfig {
  config.headers = config.headers ?? {}
  return config
}

export function onRequestError (error: AxiosError): Promise<AxiosError> {
  console.error(`[request error] [${JSON.stringify(error)}]`)
  return Promise.reject(error)
}

export function onResponse (response: AxiosResponse): Promise<any> {
  if (!response || !response.data) {
    const error: any = response
    throw error
  }
  if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return response.data
  }
  // The success envelope { message, data, …meta } is passed through whole: every provider in this
  // repo types IBaseSuccessResponse<T> and every caller already reads `.data`. (The sibling
  // Safety/Inspector app unwraps here instead — that difference is deliberate, see
  // docs/modules/api-integration/context.md.)
  return Promise.resolve(response.data)
}

export async function onResponseError (error: AxiosError): Promise<any> {
  // The store is resolved lazily inside the 401 branch below, not here: touching Pinia on every
  // error path makes this interceptor unusable outside a mounted app (and in unit tests).
  const newError = error
  const unauthorized = newError?.status === 401
  if (
    error.request && error.request.responseType === 'blob'
    && error?.response?.data instanceof Blob
    && error?.response?.data?.type
    && error?.response?.data?.type.toLowerCase().indexOf('json') !== -1
  ) {
    await new Promise((resolve: any, reject: any): void => {
      const reader = new FileReader() as any
      reader.onload = (): any => {
        // @ts-ignore: set new error data
        newError.response.data = JSON.parse(reader.result)
        resolve(Promise.reject(newError?.response?.data))
      }

      reader.onerror = (): any => {
        reject(error)
      }

      reader.readAsText(error?.response?.data)
    })

    return Promise.reject(newError?.response?.data)
  }
  if (newError.response?.status === 401 || unauthorized) {
    // A 401 from an auth endpoint is a failed sign-in, not an expired session — logging out and
    // redirecting there would replace the login form's error message with a page reload.
    const isAuthRequest = (newError.config?.url ?? '').includes('/auth/')
    const isOnAuthPage = window.location.pathname.startsWith('/auth')
    if (!isAuthRequest && !isOnAuthPage) {
      const baseUrl = window.location.origin
      useAuthStore().logout()
      window.location.href = `${baseUrl}/auth/login`
    }
    return Promise.reject(newError.response?.data)
  }
  if (newError?.response?.data) {
    // Already the backend's { code: <http status>, message, errorCode? } envelope.
    return Promise.reject(newError.response.data)
  }

  return Promise.reject(newError)
}
