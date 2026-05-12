import useInstallment from '@/pages/contract/pages/pre-contract-detail/composables/useInstallment'
import { describe, expect, it } from 'vitest'

describe('useInstallment', () => {
  const { computeLateFee } = useInstallment()

  describe('computeLateFee', () => {
    it('returns 13 for loanAmount 100000 (5% annual / 365 days)', () => {
      expect(computeLateFee({ loanAmount: 100000, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 5, lateFee: 0 })).toBe(13)
    })

    it('returns 0 when loanAmount is 0', () => {
      expect(computeLateFee({ loanAmount: 0, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 5, lateFee: 0 })).toBe(0)
    })

    it('returns 0 when loanAmount is null', () => {
      expect(computeLateFee({ loanAmount: null as unknown as number, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 5, lateFee: 0 })).toBe(0)
    })

    it('floors fractional result', () => {
      // 73000 * 0.05 = 3650 / 365 = 10.0 exactly
      expect(computeLateFee({ loanAmount: 73000, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 5, lateFee: 0 })).toBe(10)
    })
  })
})
