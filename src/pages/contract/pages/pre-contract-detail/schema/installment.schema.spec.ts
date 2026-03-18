import { describe, expect, it } from 'vitest'
import { computeInstallmentSchedule, computeMonthlyPayment, computeTotalInterest, type IInstallmentRow, type InstallmentFormValues } from './installment.schema'

const FIXED_DATE = new Date('2025-01-01T00:00:00.000Z')

// ─── computeInstallmentSchedule ──────────────────────────────────────────────

describe('computeInstallmentSchedule', (): void => {
  it('returns empty array when loanAmount is 0', (): void => {
    const values: InstallmentFormValues = { loanAmount: 0, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
    expect(computeInstallmentSchedule(values, FIXED_DATE)).toEqual([])
  })

  it('returns empty array when installments is 0', (): void => {
    const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 0, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
    expect(computeInstallmentSchedule(values, FIXED_DATE)).toEqual([])
  })

  it('returns empty array when installments is negative', (): void => {
    const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: -1, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
    expect(computeInstallmentSchedule(values, FIXED_DATE)).toEqual([])
  })

  describe('FLAT_RATE interest', (): void => {
    const values: InstallmentFormValues = {
      loanAmount: 12000,
      installmentCount: 12,
      interestType: 'FLAT_RATE',
      annualInterestRate: 12,
      lateFee: 0,
      preAssets: []
    }

    it('returns the correct number of rows', (): void => {
      expect(computeInstallmentSchedule(values, FIXED_DATE)).toHaveLength(12)
    })

    it('period numbers are sequential starting from 1', (): void => {
      const rows = computeInstallmentSchedule(values, FIXED_DATE)
      rows.forEach((row: IInstallmentRow, i: number): void => {
        expect(row.period).toBe(i + 1)
      })
    })

    it('each row has a constant payment, principal and interest', (): void => {
      // totalInterest = 12000 * 0.12 * (12/12) = 1440
      // principalPerPeriod = 12000/12 = 1000
      // interestPerPeriod = 1440/12 = 120
      // payment = 1120
      const rows = computeInstallmentSchedule(values, FIXED_DATE)
      rows.forEach((row: IInstallmentRow): void => {
        expect(row.payment).toBeCloseTo(1120, 2)
        expect(row.principal).toBeCloseTo(1000, 2)
        expect(row.interest).toBeCloseTo(120, 2)
      })
    })

    it('balance decreases by principal each period', (): void => {
      const rows = computeInstallmentSchedule(values, FIXED_DATE)
      expect(rows[0].balance).toBeCloseTo(11000, 2)
      expect(rows[1].balance).toBeCloseTo(10000, 2)
      expect(rows[5].balance).toBeCloseTo(6000, 2)
    })

    it('final balance is 0', (): void => {
      const rows = computeInstallmentSchedule(values, FIXED_DATE)
      expect(rows[rows.length - 1].balance).toBeCloseTo(0, 2)
    })

    it('dueDate is an ISO string', (): void => {
      const rows = computeInstallmentSchedule(values, FIXED_DATE)
      rows.forEach((row: IInstallmentRow): void => {
        expect(typeof row.dueDate).toBe('string')
        expect((): Date => new Date(row.dueDate)).not.toThrow()
      })
    })
  })

  describe('EFFECTIVE_RATE (reducing balance) interest', (): void => {
    const values: InstallmentFormValues = {
      loanAmount: 12000,
      installmentCount: 12,
      interestType: 'EFFECTIVE_RATE',
      annualInterestRate: 12,
      lateFee: 0,
      preAssets: []
    }

    it('returns the correct number of rows', (): void => {
      expect(computeInstallmentSchedule(values, FIXED_DATE)).toHaveLength(12)
    })

    it('period numbers are sequential starting from 1', (): void => {
      const rows = computeInstallmentSchedule(values, FIXED_DATE)
      rows.forEach((row: IInstallmentRow, i: number): void => {
        expect(row.period).toBe(i + 1)
      })
    })

    it('each payment is constant (annuity)', (): void => {
      const rows = computeInstallmentSchedule(values, FIXED_DATE)
      const firstPayment = rows[0].payment
      rows.forEach((row: IInstallmentRow): void => {
        expect(row.payment).toBeCloseTo(firstPayment, 5)
      })
    })

    it('first period interest equals opening balance * monthly rate', (): void => {
      // monthlyRate = 12/100/12 = 0.01
      // interest[0] = 12000 * 0.01 = 120
      const rows = computeInstallmentSchedule(values, FIXED_DATE)
      expect(rows[0].interest).toBeCloseTo(120, 2)
    })

    it('interest decreases over time as balance reduces', (): void => {
      const rows = computeInstallmentSchedule(values, FIXED_DATE)
      expect(rows[0].interest).toBeGreaterThan(rows[rows.length - 1].interest)
    })

    it('final balance is 0', (): void => {
      const rows = computeInstallmentSchedule(values, FIXED_DATE)
      expect(rows[rows.length - 1].balance).toBe(0)
    })

    it('dueDate is an ISO string', (): void => {
      const rows = computeInstallmentSchedule(values, FIXED_DATE)
      rows.forEach((row: IInstallmentRow): void => {
        expect(typeof row.dueDate).toBe('string')
        expect((): Date => new Date(row.dueDate)).not.toThrow()
      })
    })
  })

  it('EFFECTIVE_RATE with 0% interest: each payment equals loanAmount / installments', (): void => {
    const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, interestType: 'EFFECTIVE_RATE', annualInterestRate: 0, lateFee: 0, preAssets: [] }
    const rows = computeInstallmentSchedule(values, FIXED_DATE)
    rows.forEach((row: IInstallmentRow): void => {
      expect(row.payment).toBeCloseTo(1000, 2)
      expect(row.interest).toBeCloseTo(0, 2)
    })
    expect(rows[rows.length - 1].balance).toBeCloseTo(0, 2)
  })
})

// ─── computeMonthlyPayment ────────────────────────────────────────────────────

describe('computeMonthlyPayment', (): void => {
  it('returns 0 when loanAmount is 0', (): void => {
    const values: InstallmentFormValues = { loanAmount: 0, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
    expect(computeMonthlyPayment(values)).toBe(0)
  })

  it('returns 0 when installments is 0', (): void => {
    const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 0, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
    expect(computeMonthlyPayment(values)).toBe(0)
  })

  describe('FLAT_RATE interest', (): void => {
    it('computes monthly payment correctly', (): void => {
      // (12000 + 12000*0.12*1) / 12 = 13440 / 12 = 1120
      const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
      expect(computeMonthlyPayment(values)).toBeCloseTo(1120, 2)
    })

    it('returns loanAmount / installments when interest rate is 0%', (): void => {
      const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 0, lateFee: 0, preAssets: [] }
      expect(computeMonthlyPayment(values)).toBeCloseTo(1000, 2)
    })

    it('correctly accounts for a partial-year term (6 months)', (): void => {
      // (12000 + 12000*0.12*(6/12)) / 6 = (12000 + 720) / 6 = 2120
      const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 6, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
      expect(computeMonthlyPayment(values)).toBeCloseTo(2120, 2)
    })
  })

  describe('EFFECTIVE_RATE interest', (): void => {
    it('computes monthly payment correctly (annuity formula)', (): void => {
      const monthlyRate = 0.01
      const n = 12
      const pv = 12000
      const expected = (pv * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      const values: InstallmentFormValues = { loanAmount: pv, installmentCount: n, interestType: 'EFFECTIVE_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
      expect(computeMonthlyPayment(values)).toBeCloseTo(expected, 5)
    })

    it('returns loanAmount / installments when interest rate is 0%', (): void => {
      const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, interestType: 'EFFECTIVE_RATE', annualInterestRate: 0, lateFee: 0, preAssets: [] }
      expect(computeMonthlyPayment(values)).toBeCloseTo(1000, 2)
    })
  })

  it('EFFECTIVE_RATE monthly payment matches the payment in each schedule row', (): void => {
    const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, interestType: 'EFFECTIVE_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
    const payment = computeMonthlyPayment(values)
    const rows = computeInstallmentSchedule(values, FIXED_DATE)
    rows.forEach((row: IInstallmentRow): void => {
      expect(row.payment).toBeCloseTo(payment, 5)
    })
  })

  it('FLAT_RATE monthly payment matches the payment in each schedule row', (): void => {
    const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
    const payment = computeMonthlyPayment(values)
    const rows = computeInstallmentSchedule(values, FIXED_DATE)
    rows.forEach((row: IInstallmentRow): void => {
      expect(row.payment).toBeCloseTo(payment, 5)
    })
  })
})

// ─── computeTotalInterest ─────────────────────────────────────────────────────

describe('computeTotalInterest', (): void => {
  it('returns 0 when loanAmount is 0', (): void => {
    const values: InstallmentFormValues = { loanAmount: 0, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
    expect(computeTotalInterest(values)).toBe(0)
  })

  it('returns 0 when installments is 0', (): void => {
    const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 0, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
    expect(computeTotalInterest(values)).toBe(0)
  })

  describe('FLAT_RATE interest', (): void => {
    it('computes total interest correctly', (): void => {
      // 12000 * 0.12 * (12/12) = 1440
      const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
      expect(computeTotalInterest(values)).toBeCloseTo(1440, 2)
    })

    it('returns 0 when interest rate is 0%', (): void => {
      const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 0, lateFee: 0, preAssets: [] }
      expect(computeTotalInterest(values)).toBeCloseTo(0, 2)
    })

    it('scales proportionally for partial-year term (6 months)', (): void => {
      // 12000 * 0.12 * (6/12) = 720
      const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 6, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
      expect(computeTotalInterest(values)).toBeCloseTo(720, 2)
    })
  })

  describe('EFFECTIVE_RATE interest', (): void => {
    it('computes total interest correctly (payment*n - principal)', (): void => {
      const monthlyRate = 0.01
      const n = 12
      const pv = 12000
      const payment = (pv * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      const expected = payment * n - pv
      const values: InstallmentFormValues = { loanAmount: pv, installmentCount: n, interestType: 'EFFECTIVE_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
      expect(computeTotalInterest(values)).toBeCloseTo(expected, 2)
    })

    it('returns 0 when interest rate is 0%', (): void => {
      const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, interestType: 'EFFECTIVE_RATE', annualInterestRate: 0, lateFee: 0, preAssets: [] }
      expect(computeTotalInterest(values)).toBe(0)
    })

    it('total interest is less than FLAT_RATE for the same parameters', (): void => {
      const base: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, annualInterestRate: 12, lateFee: 0, preAssets: [] }
      const flatInterest = computeTotalInterest({ ...base, interestType: 'FLAT_RATE' })
      const reducingInterest = computeTotalInterest({ ...base, interestType: 'EFFECTIVE_RATE' })
      expect(reducingInterest).toBeLessThan(flatInterest)
    })
  })

  it('FLAT_RATE total interest equals sum of interest across all schedule rows', (): void => {
    const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, interestType: 'FLAT_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
    const rows = computeInstallmentSchedule(values, FIXED_DATE)
    const sumFromRows = rows.reduce((acc: number, row: IInstallmentRow): number => acc + row.interest, 0)
    expect(computeTotalInterest(values)).toBeCloseTo(sumFromRows, 2)
  })

  it('EFFECTIVE_RATE total interest equals sum of interest across all schedule rows', (): void => {
    const values: InstallmentFormValues = { loanAmount: 12000, installmentCount: 12, interestType: 'EFFECTIVE_RATE', annualInterestRate: 12, lateFee: 0, preAssets: [] }
    const rows = computeInstallmentSchedule(values, FIXED_DATE)
    const sumFromRows = rows.reduce((acc: number, row: IInstallmentRow): number => acc + row.interest, 0)
    expect(computeTotalInterest(values)).toBeCloseTo(sumFromRows, 2)
  })
})
