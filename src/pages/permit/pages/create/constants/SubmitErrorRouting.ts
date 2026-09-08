import axios from 'axios'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'
import type { TSafetyReadingKey } from '@/utils/PermitSafety'

/**
 * Where a rejected submit sends the user back to (0-based wizard step index), and how the
 * per-item failure arrays are pulled off the 400 body.
 *
 * Since the backend's feat-010 pass, `POST /permits/:id/submit` no longer answers with only the
 * first failing code: the 400 body carries `failures[]` (one entry per failing safety reading,
 * `{ field, errorCode, message }`) and `certificateFailures[]` (`{ workerName, errorCode,
 * message }`) alongside the unchanged `code` / `errorCode` (docs/api/GAPS.md row E, docs/api/
 * openapi.json). That lets the wizard highlight EVERY failure at once instead of marching the
 * user through them one resubmit at a time.
 *
 * The per-item `message` on each entry is backend-authored English, exactly like the envelope's
 * `message`, and is **never rendered**. Only `field` / `workerName` / `errorCode` are used — the
 * copy is localized off `errorCode` like everywhere else.
 *
 * These shapes are declared here rather than in `src/models/` because `src/models/**` is outside
 * this item's ownership; they mirror the openapi enums exactly.
 */
export interface ISubmitReadingFailure {
  field: TSafetyReadingKey
  errorCode: string
}

export interface ISubmitCertificateFailure {
  workerName: string
  errorCode: string
}

export interface ISubmitFailures {
  readings: ISubmitReadingFailure[]
  certificates: ISubmitCertificateFailure[]
}

export const EMPTY_SUBMIT_FAILURES: ISubmitFailures = { readings: [], certificates: [] }

/**
 * Every reading code lands on the Safety Checks step and both certificate codes on PPE &
 * Workers — not just the two named in PMT-009's acceptance, because `LEL_MISSING` and
 * `GAS_OUT_OF_RANGE` need the same fix in the same place. `PERMIT_POSITION_REQUIRED` (feat-023)
 * lands on the Position step.
 *
 * Keyed by `IWizardStepDef.key`, NOT a hardcoded index: the Position step only exists in
 * `useWizard`'s `steps` when an active facility plan is present, so a fixed index would be wrong
 * whenever that step is absent (every permit before the first plan is ever activated). The
 * caller (`useWizard.submitDraft`) resolves the key to an index against its OWN current `steps`
 * array via `findIndex` — see `usePlanPosition`.
 */
export const SUBMIT_ERROR_STEP_KEY: Partial<Record<EApiErrorCode, string>> = {
  [EApiErrorCode.LEL_MISSING]: 'safetyChecks',
  [EApiErrorCode.O2_MISSING]: 'safetyChecks',
  [EApiErrorCode.CO_MISSING]: 'safetyChecks',
  [EApiErrorCode.WIND_MISSING]: 'safetyChecks',
  [EApiErrorCode.GAS_OUT_OF_RANGE]: 'safetyChecks',
  [EApiErrorCode.WIND_OUT_OF_RANGE]: 'safetyChecks',
  [EApiErrorCode.CERT_MISSING]: 'ppeWorkers',
  [EApiErrorCode.CERT_EXPIRED]: 'ppeWorkers',
  [EApiErrorCode.PERMIT_POSITION_REQUIRED]: 'position',
  // wayfinder ticket 037 — the `PERMIT_AREA_REQUIRED` deployment flag's submit gate, off by
  // default today. Lands on the same step as the position picker, which now also carries the
  // area picker (`AreaPicker.vue`).
  [EApiErrorCode.AREA_REQUIRED]: 'position'
}

/** `undefined` = stay on the review step; nothing earlier can fix this code. */
export function stepKeyForSubmitError (code: string): string | undefined {
  return SUBMIT_ERROR_STEP_KEY[code as EApiErrorCode]
}

interface ISubmitErrorBody {
  failures?: unknown
  certificateFailures?: unknown
}

/**
 * `HttpRequest`'s response interceptor already unwraps a rejection down to `error.response.data`,
 * so the common case is a plain object; an `AxiosError` only survives when there was nothing to
 * unwrap. Mirrors `useApiError.extractErrorPayload` deliberately rather than reaching into it —
 * that composable's public contract is the localized `{ code, message }`, not the raw body.
 */
function extractBody (error: unknown): ISubmitErrorBody | undefined {
  if (typeof error === 'object' && error !== null && !axios.isAxiosError(error)) {
    return error as ISubmitErrorBody
  }
  if (axios.isAxiosError(error) && typeof error.response?.data === 'object' && error.response.data !== null) {
    return error.response.data as ISubmitErrorBody
  }
  return undefined
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** Pulls the two failure arrays off a rejected submit. Absent or malformed arrays yield []. */
export function extractSubmitFailures (error: unknown): ISubmitFailures {
  const body = extractBody(error)
  if (!body) return EMPTY_SUBMIT_FAILURES

  const readings: ISubmitReadingFailure[] = Array.isArray(body.failures)
    ? body.failures
      .filter((entry: unknown): boolean => isRecord(entry) && typeof entry.field === 'string')
      .map((entry: unknown): ISubmitReadingFailure => ({
        field: (entry as Record<string, unknown>).field as TSafetyReadingKey,
        errorCode: String((entry as Record<string, unknown>).errorCode ?? '')
      }))
    : []

  const certificates: ISubmitCertificateFailure[] = Array.isArray(body.certificateFailures)
    ? body.certificateFailures
      .filter((entry: unknown): boolean => isRecord(entry) && typeof entry.workerName === 'string')
      .map((entry: unknown): ISubmitCertificateFailure => ({
        workerName: (entry as Record<string, unknown>).workerName as string,
        errorCode: String((entry as Record<string, unknown>).errorCode ?? '')
      }))
    : []

  return { readings, certificates }
}

/**
 * The step key to land on, preferring the failure arrays over the single envelope `errorCode`: if
 * the server reported failing readings, the readings step is where the fix is, whatever code
 * happened to be first.
 */
export function stepKeyForSubmitFailure (code: string, failures: ISubmitFailures): string | undefined {
  if (failures.readings.length > 0) return 'safetyChecks'
  if (failures.certificates.length > 0) return 'ppeWorkers'
  return stepKeyForSubmitError(code)
}
