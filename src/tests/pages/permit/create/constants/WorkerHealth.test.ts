import { describe, expect, it } from 'vitest'
import { EPermitType } from '@/enums/modules/permit/PermitType.enum'
import {
  requiresHealthCheck, workerHealthIssues, workerHealthPassed, workerRoleSlug, workerRowComplete
} from '@/pages/permit/pages/create/constants/WorkerHealth'

/** PMT-007 — mirrors the design's own evaluation at design line ~1955, asymmetry included. */
describe('workerHealthIssues — blood pressure', () => {
  it('passes a normal reading', () => {
    expect(workerHealthIssues({ bloodPressure: '119/78', alcoholReading: '0.00' })).toEqual([])
  })

  it.each(['140/80', '90/90', '89/70', '110/59', 'abc/def'])(
    'flags %s as abnormal', (bloodPressure: string) => {
      expect(workerHealthIssues({ bloodPressure, alcoholReading: '0.00' })).toContain('BLOOD_PRESSURE')
    }
  )

  it.each(['139/89', '90/60'])('accepts the in-range boundary %s', (bloodPressure: string) => {
    expect(workerHealthIssues({ bloodPressure, alcoholReading: '0.00' })).not.toContain('BLOOD_PRESSURE')
  })

  it('treats a blank BP as unrecorded rather than abnormal — it does not fail on its own', () => {
    expect(workerHealthIssues({ bloodPressure: '', alcoholReading: '0.00' })).toEqual([])
  })
})

describe('workerHealthIssues — alcohol', () => {
  it('passes exactly 0', () => {
    expect(workerHealthIssues({ bloodPressure: '119/78', alcoholReading: '0.00' })).toEqual([])
  })

  it('fails anything above 0 mg% — the regulation is zero tolerance', () => {
    expect(workerHealthIssues({ bloodPressure: '119/78', alcoholReading: '0.01' })).toEqual(['ALCOHOL'])
  })

  it('fails a blank or unparseable reading — a test that was never taken is not a pass', () => {
    expect(workerHealthIssues({ bloodPressure: '119/78' })).toEqual(['ALCOHOL'])
    expect(workerHealthIssues({ bloodPressure: '119/78', alcoholReading: 'n/a' })).toEqual(['ALCOHOL'])
  })

  it('so a freshly added worker reads as failing until their test is entered', () => {
    expect(workerHealthPassed({ workerId: 761, workerName: 'Somchai', roleOnPermit: 'Entrant' })).toBe(false)
  })
})

describe('health-check scope and row completeness', () => {
  it('applies the pre-work health check to Confined Space only', () => {
    expect(requiresHealthCheck(EPermitType.CONFINED)).toBe(true)
    expect(requiresHealthCheck(EPermitType.HOT)).toBe(false)
    expect(requiresHealthCheck(EPermitType.HEIGHTS)).toBe(false)
    expect(requiresHealthCheck(undefined)).toBe(false)
  })

  it('requires both fields PATCH declares minLength: 1 on', () => {
    expect(workerRowComplete({ workerId: 761, workerName: 'Somchai', roleOnPermit: 'Entrant' })).toBe(true)
    expect(workerRowComplete({ workerId: 596, workerName: '   ', roleOnPermit: 'Entrant' })).toBe(false)
    expect(workerRowComplete({ workerId: 761, workerName: 'Somchai', roleOnPermit: '' })).toBe(false)
  })

  // wayfinder 063 — `PermitWorker.workerId` is `NOT NULL`; a row with a name typed but no Worker
  // picked yet (WorkerPicker hasn't resolved one) is incomplete, same as a missing role.
  it('is incomplete with no workerId, even with a name and role filled', () => {
    expect(workerRowComplete({ workerName: 'Somchai', roleOnPermit: 'Entrant' })).toBe(false)
  })

  it('slugs a role into a safe locale key', () => {
    expect(workerRoleSlug('Fire Watcher')).toBe('fire-watcher')
    expect(workerRoleSlug('Supervisor')).toBe('supervisor')
  })
})
