import type { App } from 'vue'
import type { ToastServiceMethods } from 'primevue/toastservice'

let toastService: ToastServiceMethods | null = null

export function registerToastService (app: App<Element>): void {
  const service = app.config.globalProperties.$toast as ToastServiceMethods | undefined
  toastService = service ?? null
}

export function getToastService (): ToastServiceMethods | null {
  return toastService
}

export const toast = {
  success (message: string, summary: string = 'Success'): void {
    toastService?.add({
      severity: 'success',
      summary,
      detail: message,
      life: 3000
    })
  },
  warn (message: string, summary: string = 'Warning'): void {
    toastService?.add({
      severity: 'warn',
      summary,
      detail: message,
      life: 3000
    })
  },
  error (message: string, summary: string = 'Error'): void {
    toastService?.add({
      severity: 'error',
      summary,
      detail: message,
      life: 4000
    })
  }
}
