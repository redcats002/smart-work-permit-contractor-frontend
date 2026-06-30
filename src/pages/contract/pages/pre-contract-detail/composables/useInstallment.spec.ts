import { InterestTypeEnum } from '@/enums/modules/contract/InterestType.enum'
import { describe, expect, it } from 'vitest'
import { type IInstallmentRow, type IOperationInstallment, useInstallment } from './useInstallment'

const FIXED_DATE = new Date('2025-01-01T00:00:00.000Z')

const BASE: IOperationInstallment = {
  loanAmount: 12000,
  installmentCount: 12,
  interestType: InterestTypeEnum.FLAT_RATE,
  annualInterestRate: 12,
  contractedAt: FIXED_DATE
}

describe('generateInstallments', (): void => {
  it('returns empty array when loanAmount is 0', (): void => {
    expect(useInstallment({ ...BASE, loanAmount: 0 })).toEqual([])
  })

  it('returns empty array when installmentCount is 0', (): void => {
    expect(useInstallment({ ...BASE, installmentCount: 0 })).toEqual([])
  })

  it('returns empty array when installmentCount is negative', (): void => {
    expect(useInstallment({ ...BASE, installmentCount: -1 })).toEqual([])
  })

  describe('FLAT_RATE', (): void => {
    it('returns the correct number of rows', (): void => {
      expect(useInstallment(BASE)).toHaveLength(12)
    })

    it('order numbers are sequential starting from 1', (): void => {
      const rows = useInstallment(BASE)
      rows.forEach((row: IInstallmentRow, i: number): void => {
        expect(row.order).toBe(i + 1)
      })
    })

    it('each row has constant installment, principal, and interest', (): void => {
      // totalInterest = 12000 * 0.12 * (12/12) = 1440
      // principal = 12000/12 = 1000
      // interest = 1440/12 = 120
      // installment = 1120
      const rows = useInstallment(BASE)
      rows.forEach((row: IInstallmentRow): void => {
        expect(row.installment).toBeCloseTo(1120, 2)
        expect(row.principal).toBeCloseTo(1000, 2)
        expect(row.interest).toBeCloseTo(120, 2)
        expect(row.outstandingPrincipal).toBeCloseTo(row.principal, 5)
        expect(row.outstandingInterest).toBeCloseTo(row.interest, 5)
      })
    })

    it('remainingPrincipal decreases by principal each period', (): void => {
      const rows = useInstallment(BASE)
      expect(rows[0].remainingPrincipal).toBeCloseTo(11000, 2)
      expect(rows[1].remainingPrincipal).toBeCloseTo(10000, 2)
      expect(rows[5].remainingPrincipal).toBeCloseTo(6000, 2)
    })

    it('final remainingPrincipal is 0', (): void => {
      const rows = useInstallment(BASE)
      expect(rows[rows.length - 1].remainingPrincipal).toBeCloseTo(0, 2)
    })

    it('dueDate is a valid ISO string incrementing by month', (): void => {
      const rows = useInstallment(BASE)
      rows.forEach((row: IInstallmentRow): void => {
        expect(typeof row.dueDate).toBe('string')
        expect((): Date => new Date(row.dueDate)).not.toThrow()
      })
      const d1 = new Date(rows[0].dueDate)
      const d2 = new Date(rows[1].dueDate)
      expect(d2.getMonth() - d1.getMonth()).toBe(1)
    })

    it('clamps contractedAt day to 28 when day >= 28', (): void => {
      const rows = useInstallment({ ...BASE, contractedAt: new Date('2025-01-31T00:00:00.000Z') })
      rows.forEach((row: IInstallmentRow): void => {
        expect(new Date(row.dueDate).getDate()).toBe(28)
      })
    })

    it('returns 0 interest when annualInterestRate is 0', (): void => {
      const rows = useInstallment({ ...BASE, annualInterestRate: 0 })
      rows.forEach((row: IInstallmentRow): void => {
        expect(row.interest).toBeCloseTo(0, 2)
        expect(row.installment).toBeCloseTo(1000, 2)
      })
    })

    it('correctly accounts for partial-year term (6 months)', (): void => {
      // totalInterest = 12000 * 0.12 * (6/12) = 720; interest/period = 120; principal = 2000; installment = 2120
      const rows = useInstallment({ ...BASE, installmentCount: 6 })
      rows.forEach((row: IInstallmentRow): void => {
        expect(row.installment).toBeCloseTo(2120, 2)
      })
    })
  })

  describe('EFFECTIVE_RATE', (): void => {
    it('throws an error', (): void => {
      expect((): IInstallmentRow[] => useInstallment({ ...BASE, interestType: InterestTypeEnum.EFFECTIVE_RATE }))
        .toThrow('กำลังปรับปรุงวิธีคำนวณ ลดต้นลดดอก')
    })
  })
})
