import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { z } from 'zod'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import { useWizard } from '@/pages/permit/pages/create/composables/useWizard'
import type { IWizardStepDef } from '@/pages/permit/pages/create/wizard/WizardSteps'

/**
 * CRT-004 — the shared client-side certificate pre-flight (`useCertificatePreflight`, hoisted
 * into `useWizard`) that gates step 4's Next and feeds step 6's review row.
 *
 * Only a CONFIRMED 'fail' verdict may gate anything — never 'loading'/'unknown' — because an
 * unresolved or failed lookup must never be stricter than the server's real verdict at submit
 * (../PROMPT-LOG.md "no client-side rule that blocks what the server would accept", and the JSA
 * "at least one row" dead-end it cites as the failure mode to avoid repeating).
 *
 * The check is triggered on COMMIT, not on edits: `recheckCertificates()` is the only entry point
 * (see its doc on IUseWizard). These tests therefore call it explicitly after seeding workers,
 * exactly as step 4 does on option-select / blur — the debounced `formData.workers` watch this
 * file used to drive was removed because it closed the suggestion overlay mid-typing.
 */
const StubComponent = defineComponent({ template: '<div />' })

function makeSteps (): IWizardStepDef[] {
  return [
    { key: 'first', labelKey: 'permit.wizard.step.1', component: StubComponent, schema: z.object({}) },
    { key: 'ppeWorkers', labelKey: 'permit.wizard.step.4', component: StubComponent, schema: z.object({}) }
  ]
}

function validCertificate (workerName: string): Record<string, unknown> {
  return {
    id: 1,
    workerName,
    role: 'Operator',
    certType: 'hot-work',
    issuedDate: '2026-01-01',
    expiryDate: '2027-01-01',
    expired: false
  }
}

async function flushMicrotasks (): Promise<void> {
  for (let i = 0; i < 20; i++) {
    await Promise.resolve()
  }
}

describe('useWizard — certificate pre-flight gate (CRT-004)', () => {
  beforeEach((): void => {
    vi.useFakeTimers()
  })

  afterEach((): void => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('blocks Next on the PPE & Workers step while a named worker has no certificate, and names them', async () => {
    vi.spyOn(CertificateProvider.prototype, 'byWorker').mockResolvedValue({ message: 'ok', data: null } as never)

    const wizard = useWizard(makeSteps())
    wizard.next()
    expect(wizard.currentStep.value.key).toBe('ppeWorkers')

    wizard.updateFormData({ workers: [{ workerName: 'Somchai', roleOnPermit: 'Operator' }] })
    wizard.recheckCertificates()
    await flushMicrotasks()

    expect(wizard.certificateState.value).toBe('fail')
    expect(wizard.certificateProblems.value).toEqual([{ workerName: 'Somchai', reason: 'MISSING' }])
    expect(wizard.isNextBlocked.value).toBe(true)
  })

  it('unblocks once the worker has a valid, unexpired certificate', async () => {
    vi.spyOn(CertificateProvider.prototype, 'byWorker')
      .mockResolvedValue({ message: 'ok', data: validCertificate('Somchai') } as never)

    const wizard = useWizard(makeSteps())
    wizard.next()

    wizard.updateFormData({ workers: [{ workerName: 'Somchai', roleOnPermit: 'Operator' }] })
    wizard.recheckCertificates()
    await flushMicrotasks()

    expect(wizard.certificateState.value).toBe('pass')
    expect(wizard.isNextBlocked.value).toBe(false)
  })

  it('never blocks Next on an unresolved lookup — only a confirmed fail gates', async () => {
    let resolveByWorker: (value: unknown) => void = (): void => undefined
    const deferred = new Promise((resolve: (value: unknown) => void): void => {
      resolveByWorker = resolve
    })
    vi.spyOn(CertificateProvider.prototype, 'byWorker').mockReturnValue(deferred as never)

    const wizard = useWizard(makeSteps())
    wizard.next()

    wizard.updateFormData({ workers: [{ workerName: 'Somchai', roleOnPermit: 'Operator' }] })
    wizard.recheckCertificates()
    await flushMicrotasks()

    expect(wizard.certificateState.value).toBe('loading')
    expect(wizard.isNextBlocked.value).toBe(false)

    resolveByWorker({ message: 'ok', data: null })
    await flushMicrotasks()

    expect(wizard.certificateState.value).toBe('fail')
    expect(wizard.isNextBlocked.value).toBe(true)
  })

  it('discards a stale check that resolves after a newer one, so Next never sticks blocked on an outdated verdict', async () => {
    let resolveFirst: (value: unknown) => void = (): void => undefined
    let resolveSecond: (value: unknown) => void = (): void => undefined
    const first = new Promise((resolve: (value: unknown) => void): void => {
      resolveFirst = resolve
    })
    const second = new Promise((resolve: (value: unknown) => void): void => {
      resolveSecond = resolve
    })
    const byWorkerSpy = vi.spyOn(CertificateProvider.prototype, 'byWorker')
    byWorkerSpy.mockReturnValueOnce(first as never)
    byWorkerSpy.mockReturnValueOnce(second as never)

    const wizard = useWizard(makeSteps())
    wizard.next()

    wizard.updateFormData({ workers: [{ workerName: 'Somchai', roleOnPermit: 'Operator' }] })
    wizard.recheckCertificates() // first check's byWorker call fires
    await flushMicrotasks()

    wizard.updateFormData({ workers: [{ workerName: 'Malee', roleOnPermit: 'Operator' }] })
    wizard.recheckCertificates() // second (newer) check's byWorker call fires
    await flushMicrotasks()

    // The newer check resolves first, cleanly...
    resolveSecond({ message: 'ok', data: validCertificate('Malee') })
    await flushMicrotasks()
    expect(wizard.certificateState.value).toBe('pass')

    // ...then the stale first check resolves as missing. It must be discarded, not overwrite 'pass'.
    resolveFirst({ message: 'ok', data: null })
    await flushMicrotasks()

    expect(wizard.certificateState.value).toBe('pass')
    expect(wizard.isNextBlocked.value).toBe(false)
  })
})
