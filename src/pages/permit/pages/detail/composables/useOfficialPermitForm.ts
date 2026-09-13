import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { useApiError } from '@/composables/useApiError'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import type { IGasLogEntryWire } from '@/models/response/gas-log/GasLogRes.model'
import GasLogProvider, { type IGasLogProvider } from '@/resources/provider/gas-log/GasLog.provider'
import PinProvider, { type IPinProvider } from '@/resources/provider/pin/Pin.provider'
import UserProvider, { type IUserProvider } from '@/resources/provider/user/User.provider'
import { EPermitType } from '@/enums/modules/permit/PermitType.enum'
import { buildOfficialFormConfig } from '@/pages/permit/pages/detail/constants/OfficialFormConfig'
import type { IOfficialFormConfig } from '@/pages/permit/pages/detail/constants/OfficialFormBlocks.model'

const PinService: IPinProvider = new PinProvider()
const UserService: IUserProvider = new UserProvider()
const GasLogService: IGasLogProvider = new GasLogProvider()

export interface IUseOfficialPermitForm {
  config: ComputedRef<IOfficialFormConfig | null>
  loading: Ref<boolean>
  /** Lazily resolves the pin name / contractor firm / latest gas reading, then builds the config. */
  fetchOfficialForm (): Promise<void>
}

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. Same lazy-fetch shape
 * `usePermitReport.ts` already uses for the sibling full-report print feature: every read here is
 * independent, degrades to `null` on failure (a print trigger must never throw), and nothing is
 * fetched until the trigger is actually clicked.
 */
export function useOfficialPermitForm (permitId: string, permit: Ref<IPermitDetail>): IUseOfficialPermitForm {
  const { mapError } = useApiError()

  const pinName = ref<string | null>(null)
  const firmName = ref<string | null>(null)
  const latestGasEntry = ref<IGasLogEntryWire | null>(null)
  const loading = ref(false)

  const config: ComputedRef<IOfficialFormConfig | null> = computed((): IOfficialFormConfig | null => {
    if (!permit.value) return null
    return buildOfficialFormConfig(permit.value, {
      pinName: pinName.value,
      firmName: firmName.value,
      latestGasEntry: latestGasEntry.value
    })
  })

  async function fetchPinName (): Promise<void> {
    if (!permit.value.pinId) {
      pinName.value = null
      return
    }
    try {
      const response = await PinService.getById(permit.value.pinId)
      pinName.value = response.data.name
    } catch (error: unknown) {
      pinName.value = null
      console.error('[useOfficialPermitForm] pin fetch failed', mapError(error).code)
    }
  }

  async function fetchFirmName (): Promise<void> {
    try {
      const response = await UserService.me()
      firmName.value = response.data.contractorProfile?.firmName ?? null
    } catch (error: unknown) {
      firmName.value = null
      console.error('[useOfficialPermitForm] user profile fetch failed', mapError(error).code)
    }
  }

  /** Confined Space only — rule 2: the single most recent `gas_log_entries` row, or `null` if none. */
  async function fetchLatestGasEntry (): Promise<void> {
    if (permit.value.type !== EPermitType.CONFINED) {
      latestGasEntry.value = null
      return
    }
    try {
      const response = await GasLogService.list(permitId)
      latestGasEntry.value = response.data.reduce(
        (latest: IGasLogEntryWire | null, entry: IGasLogEntryWire): IGasLogEntryWire | null => {
          if (!latest) return entry
          return new Date(entry.recordedAt).getTime() > new Date(latest.recordedAt).getTime() ? entry : latest
        }, null)
    } catch (error: unknown) {
      latestGasEntry.value = null
      console.error('[useOfficialPermitForm] gas-log fetch failed', mapError(error).code)
    }
  }

  async function fetchOfficialForm (): Promise<void> {
    loading.value = true
    try {
      await Promise.all([fetchPinName(), fetchFirmName(), fetchLatestGasEntry()])
    } finally {
      loading.value = false
    }
  }

  return { config, loading, fetchOfficialForm }
}

export default useOfficialPermitForm
