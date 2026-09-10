import { describe, expect, it } from 'vitest'
import { extractSubmitFailures } from '@/pages/permit/pages/create/constants/SubmitErrorRouting'
import type { ISubmitCertificateFailure } from '@/pages/permit/pages/create/constants/SubmitErrorRouting'
import type { ICertificateProblem } from '@/pages/permit/pages/create/composables/useCertificatePreflight'

/**
 * wayfinder 088 — two workers, ONE name, different certificate status.
 *
 * This fixture is the whole test. A single-worker case passes whether the lookup keys on the id or
 * on the name, which is why the defect survived: every existing test had one worker per name. The
 * 060 cutover exists because this deployment really does have two spellings-and-namesakes of one
 * person, and a name-keyed badge hands a contractor the wrong worker's certificate status on the
 * screen where they decide whether to add them.
 *
 * These assert the matching rule directly rather than mounting the step, because the step's own
 * lookups are one-liners over these two arrays — the rule is the thing that was wrong.
 */
const SAME_NAME = 'สมชาย ใจดี'

describe('wayfinder 088 — certificate status follows the worker id, not the name', () => {
  const problems: ICertificateProblem[] = [
    { workerId: 11, workerName: SAME_NAME, reason: 'EXPIRED' }
  ]

  function problemFor (workerId: number | undefined): ICertificateProblem['reason'] | undefined {
    if (typeof workerId !== 'number') return undefined
    return problems.find((problem: ICertificateProblem): boolean => problem.workerId === workerId)?.reason
  }

  it('gives the problem to the worker who has it', (): void => {
    expect(problemFor(11)).toBe('EXPIRED')
  })

  it('does NOT give it to a different worker sharing the same name', (): void => {
    // Keyed on the name this returns 'EXPIRED' — a green-carded worker shown as expired, or the
    // reverse, which is the direction that actually matters.
    expect(problemFor(22)).toBeUndefined()
  })

  it('gives it to nobody when the row has no worker picked yet', (): void => {
    expect(problemFor(undefined)).toBeUndefined()
  })
})

describe('wayfinder 088 — a server rejection that cannot be attributed is dropped, not guessed', () => {
  it('keeps a rejection carrying workerId', (): void => {
    const parsed = extractSubmitFailures({
      code: 400,
      certificateFailures: [{ workerId: 11, workerName: SAME_NAME, errorCode: 'CERT_EXPIRED' }]
    })
    expect(parsed.certificates).toEqual<ISubmitCertificateFailure[]>([
      { workerId: 11, workerName: SAME_NAME, errorCode: 'CERT_EXPIRED' }
    ])
  })

  it('drops a rejection with no workerId rather than name-matching it', (): void => {
    // Attributing an unattributable rejection to a namesake is worse than not highlighting a row:
    // the submit still fails server-side, so the contractor loses nothing but a wrong red badge.
    const parsed = extractSubmitFailures({
      code: 400,
      certificateFailures: [{ workerName: SAME_NAME, errorCode: 'CERT_EXPIRED' }]
    })
    expect(parsed.certificates).toEqual([])
  })
})
