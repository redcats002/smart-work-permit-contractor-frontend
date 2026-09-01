import { describe, expect, it } from 'vitest'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'
import {
  EMPTY_SUBMIT_FAILURES, extractSubmitFailures, stepKeyForSubmitError, stepKeyForSubmitFailure
} from '@/pages/permit/pages/create/constants/SubmitErrorRouting'

/**
 * PMT-009. `POST /permits/:id/submit` answers 400 with `failures[]` + `certificateFailures[]`
 * since the backend's feat-010 pass; the envelope `message` (backend-authored English joining
 * every failure with '; ') is never touched here or anywhere else.
 */
describe('extractSubmitFailures', () => {
  it('pulls every failing reading, not just the first', () => {
    const failures = extractSubmitFailures({
      code: 400,
      message: 'LEL must be 0%; O2 must be between 19.5 and 23.5',
      errorCode: EApiErrorCode.GAS_OUT_OF_RANGE,
      failures: [
        { field: 'lel', errorCode: 'GAS_OUT_OF_RANGE', message: 'LEL must be 0%' },
        { field: 'o2', errorCode: 'O2_MISSING', message: 'O2 missing' }
      ]
    })
    expect(failures.readings).toEqual([
      { field: 'lel', errorCode: 'GAS_OUT_OF_RANGE' },
      { field: 'o2', errorCode: 'O2_MISSING' }
    ])
    expect(failures.certificates).toEqual([])
  })

  it('pulls certificate failures keyed by worker', () => {
    const failures = extractSubmitFailures({
      code: 400,
      errorCode: EApiErrorCode.CERT_EXPIRED,
      certificateFailures: [{ workerName: 'Somchai', errorCode: 'CERT_EXPIRED', message: 'expired' }]
    })
    expect(failures.certificates).toEqual([{ workerName: 'Somchai', errorCode: 'CERT_EXPIRED' }])
  })

  it('never carries the backend-authored per-item message through', () => {
    const failures = extractSubmitFailures({
      failures: [{ field: 'lel', errorCode: 'GAS_OUT_OF_RANGE', message: 'LEL must be 0%' }]
    })
    expect(JSON.stringify(failures)).not.toContain('LEL must be 0%')
  })

  it('tolerates an absent or malformed body', () => {
    expect(extractSubmitFailures(undefined)).toEqual(EMPTY_SUBMIT_FAILURES)
    expect(extractSubmitFailures({ code: 403, errorCode: 'PERMIT_NOT_SUBMITTABLE' })).toEqual(EMPTY_SUBMIT_FAILURES)
    expect(extractSubmitFailures({ failures: 'not-an-array' })).toEqual(EMPTY_SUBMIT_FAILURES)
    expect(extractSubmitFailures({ failures: [{ nope: 1 }] }).readings).toEqual([])
  })
})

describe('step routing', () => {
  it('sends every reading code to Safety Checks and both certificate codes to PPE & Workers', () => {
    for (const code of ['LEL_MISSING', 'O2_MISSING', 'CO_MISSING', 'WIND_MISSING', 'GAS_OUT_OF_RANGE', 'WIND_OUT_OF_RANGE']) {
      expect(stepKeyForSubmitError(code)).toBe('safetyChecks')
    }
    expect(stepKeyForSubmitError('CERT_MISSING')).toBe('ppeWorkers')
    expect(stepKeyForSubmitError('CERT_EXPIRED')).toBe('ppeWorkers')
  })

  it('sends PERMIT_POSITION_REQUIRED to the Position step', () => {
    expect(stepKeyForSubmitError('PERMIT_POSITION_REQUIRED')).toBe('position')
  })

  // wayfinder ticket 037 — the `PERMIT_AREA_REQUIRED` deployment flag's submit gate lands on the
  // same step as the position picker, which now also carries the area picker.
  it('sends AREA_REQUIRED to the Position step', () => {
    expect(stepKeyForSubmitError('AREA_REQUIRED')).toBe('position')
  })

  it('stays on Review for a code no earlier step can fix', () => {
    expect(stepKeyForSubmitError('PERMIT_NOT_SUBMITTABLE')).toBeUndefined()
    expect(stepKeyForSubmitError('RATE_LIMITED')).toBeUndefined()
  })

  it('prefers the failure arrays over the envelope code', () => {
    // The envelope says CERT_EXPIRED, but readings also failed — readings is the earlier fix.
    expect(stepKeyForSubmitFailure('CERT_EXPIRED', {
      readings: [{ field: 'lel', errorCode: 'GAS_OUT_OF_RANGE' }],
      certificates: [{ workerName: 'Somchai', errorCode: 'CERT_EXPIRED' }]
    })).toBe('safetyChecks')

    expect(stepKeyForSubmitFailure('PERMIT_NOT_SUBMITTABLE', {
      readings: [],
      certificates: [{ workerName: 'Somchai', errorCode: 'CERT_MISSING' }]
    })).toBe('ppeWorkers')

    expect(stepKeyForSubmitFailure('GAS_OUT_OF_RANGE', EMPTY_SUBMIT_FAILURES)).toBe('safetyChecks')
  })
})
