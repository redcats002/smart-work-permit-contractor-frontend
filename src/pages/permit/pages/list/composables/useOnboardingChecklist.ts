import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import WorkerProvider, { type IWorkerProvider } from '@/resources/provider/worker/Worker.provider'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'

const WorkerService: IWorkerProvider = new WorkerProvider()
const CertificateService: ICertificateProvider = new CertificateProvider()

const STORAGE_PREFIX = 'smart-work-permit:onboarding-checklist-dismissed:'

export type TOnboardingChecklistKey = 'workers' | 'certificates' | 'permit'

export interface IOnboardingChecklistItem {
  key: TOnboardingChecklistKey
  labelKey: string
  done: boolean
  to: { name: string }
}

export interface IUseOnboardingChecklist {
  loading: Ref<boolean>
  dismissed: Ref<boolean>
  items: ComputedRef<IOnboardingChecklistItem[]>
  allDone: ComputedRef<boolean>
  visible: ComputedRef<boolean>
  dismiss (): void
  /**
   * `hasPermit` comes from the SAME fetch `PermitListPage` already ran (`useMyPermits`) — never a
   * second, parallel query — so this checklist's third row can never drift from what the list
   * below it shows (wayfinder 077's named failure case: "0 workers" here while `/workers` shows
   * twelve).
   */
  refresh (hasPermit: boolean): Promise<void>
}

/**
 * wayfinder 077 — the first-run checklist. Workers and certificates are NOT otherwise fetched on
 * `PermitListPage`, so those two rows are genuinely separate, lightweight, count-only requests
 * (`limit: 1`, no full list needed) — the permit row is not, and must be wired off the page's own
 * fetch instead of a fourth query.
 */
export function useOnboardingChecklist (): IUseOnboardingChecklist {
  const authStore = useAuthStore()

  const loading = ref(false)
  const hasWorkers = ref(false)
  const hasCertificates = ref(false)
  const hasPermit = ref(false)

  function storageKey (): string {
    return `${STORAGE_PREFIX}${authStore.user.id ?? 'anonymous'}`
  }

  function readDismissed (): boolean {
    try {
      return localStorage.getItem(storageKey()) === '1'
    } catch {
      // localStorage unavailable (private mode, disabled storage) — never dismissed by default
      return false
    }
  }

  const dismissed = ref(readDismissed())

  function dismiss (): void {
    dismissed.value = true
    try {
      localStorage.setItem(storageKey(), '1')
    } catch {
      // best-effort — the checklist just re-shows next session if this fails
    }
  }

  async function refresh (permitExists: boolean): Promise<void> {
    loading.value = true
    hasPermit.value = permitExists
    try {
      const [workerResponse, certificateResponse] = await Promise.all([
        WorkerService.list({ page: 1, limit: 1 }),
        CertificateService.list({ page: 1, limit: 1 })
      ])
      hasWorkers.value = workerResponse.count > 0
      hasCertificates.value = certificateResponse.count > 0
    } catch {
      // A failed preflight leaves the checklist rows unticked rather than throwing a toast over
      // a non-critical widget on top of the permit list — the list itself has its own error path.
      hasWorkers.value = false
      hasCertificates.value = false
    } finally {
      loading.value = false
    }
  }

  const items: ComputedRef<IOnboardingChecklistItem[]> = computed((): IOnboardingChecklistItem[] => [
    { key: 'workers', labelKey: 'permit.list.checklist.registerWorkers', done: hasWorkers.value, to: { name: 'WorkerListPage' } },
    { key: 'certificates', labelKey: 'permit.list.checklist.uploadCertificates', done: hasCertificates.value, to: { name: 'CertificateListPage' } },
    { key: 'permit', labelKey: 'permit.list.checklist.createFirstPermit', done: hasPermit.value, to: { name: 'PermitCreatePage' } }
  ])

  const allDone: ComputedRef<boolean> = computed((): boolean => items.value.every((item: IOnboardingChecklistItem): boolean => item.done))

  const visible: ComputedRef<boolean> = computed((): boolean => !dismissed.value && !allDone.value)

  return {
    loading,
    dismissed,
    items,
    allDone,
    visible,
    dismiss,
    refresh
  }
}

export default useOnboardingChecklist
