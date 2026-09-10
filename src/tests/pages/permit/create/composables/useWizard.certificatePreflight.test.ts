import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { z } from 'zod'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import { useWizard } from '@/pages/permit/pages/create/composables/useWizard'
import type { IWizardStepDef } from '@/pages/permit/pages/create/wizard/WizardSteps'

/**
 * CRT-004 / wayfinder 063 — the shared client-side certificate pre-flight
 * (`useCertificatePreflight`, hoisted into `useWizard`) that feeds step 4's per-worker warning
 * and step 6's review row.
 *
 * **These four cases INVERT their pre-063 assertions.** 059 ruling 5 / 063 reverse 003's
 * 2026-08-31 amendment: a confirmed certificate `fail` used to disable step 4's Next, which was
 * STRICTER than the server (submit is the only place the server itself gates on a certificate,
 * per "a client may mirror a rule for instant feedback, never to gate beyond it"). Next is now
 * NEVER blocked by certificate state — `isNextBlocked` must stay `false` throughout, regardless
 * of `certificateState`. `certificateState`/`certificateProblems` still track the real verdict
 * (asserted below), because step 4's per-row warning and step 6's blocking review row both read
 * them, and `canSubmit` still mirrors the server by staying `false` on a confirmed `fail` — that
 * gate is unchanged by this ticket and is not tested here (see the Submit-gate coverage instead).
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
    workerId: 761,
    workerName,
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

describe('useWizard — certificate pre-flight never gates Next (wayfinder 063, reverses 059 ruling 5)', () => {
  beforeEach((): void => {
    vi.useFakeTimers()
  })

  afterEach((): void => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('never blocks Next on a confirmed MISSING certificate — only warns via certificateState/Problems', async () => {
    vi.spyOn(CertificateProvider.prototype, 'byWorker').mockResolvedValue({ message: 'ok', data: null } as never)

    const wizard = useWizard(makeSteps())
    wizard.next()
    expect(wizard.currentStep.value.key).toBe('ppeWorkers')

    wizard.updateFormData({ workers: [{ workerId: 761, workerName: 'Somchai', roleOnPermit: 'Operator' }] })
    wizard.recheckCertificates()
    await flushMicrotasks()

    expect(wizard.certificateState.value).toBe('fail')
    expect(wizard.certificateProblems.value).toEqual([{ workerName: 'Somchai', reason: 'MISSING' }])
    expect(wizard.isNextBlocked.value).toBe(false)
  })

  it('stays unblocked once the worker has a valid, unexpired certificate', async () => {
    vi.spyOn(CertificateProvider.prototype, 'byWorker')
      .mockResolvedValue({ message: 'ok', data: validCertificate('Somchai') } as never)

    const wizard = useWizard(makeSteps())
    wizard.next()

    wizard.updateFormData({ workers: [{ workerId: 761, workerName: 'Somchai', roleOnPermit: 'Operator' }] })
    wizard.recheckCertificates()
    await flushMicrotasks()

    expect(wizard.certificateState.value).toBe('pass')
    expect(wizard.isNextBlocked.value).toBe(false)
  })

  it('never blocks Next while the lookup is unresolved (loading) either', async () => {
    let resolveByWorker: (value: unknown) => void = (): void => undefined
    const deferred = new Promise((resolve: (value: unknown) => void): void => {
      resolveByWorker = resolve
    })
    vi.spyOn(CertificateProvider.prototype, 'byWorker').mockReturnValue(deferred as never)

    const wizard = useWizard(makeSteps())
    wizard.next()

    wizard.updateFormData({ workers: [{ workerId: 761, workerName: 'Somchai', roleOnPermit: 'Operator' }] })
    wizard.recheckCertificates()
    await flushMicrotasks()

    expect(wizard.certificateState.value).toBe('loading')
    expect(wizard.isNextBlocked.value).toBe(false)

    resolveByWorker({ message: 'ok', data: null })
    await flushMicrotasks()

    // The verdict resolves to a confirmed fail — the row's warning would now show it — but Next
    // stays open regardless, which is the whole point of this ticket.
    expect(wizard.certificateState.value).toBe('fail')
    expect(wizard.isNextBlocked.value).toBe(false)
  })

  it('discards a stale check that resolves after a newer one, so certificateState never sticks on an outdated verdict', async () => {
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

    wizard.updateFormData({ workers: [{ workerId: 761, workerName: 'Somchai', roleOnPermit: 'Operator' }] })
    wizard.recheckCertificates() // first check's byWorker call fires
    await flushMicrotasks()

    wizard.updateFormData({ workers: [{ workerId: 836, workerName: 'Malee', roleOnPermit: 'Operator' }] })
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
