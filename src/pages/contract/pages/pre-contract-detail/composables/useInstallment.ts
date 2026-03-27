import type { InstallmentFormValues } from '../schema/make-contract.schema'

export interface IInstallmentRow {
  period: number
  dueDate: string
  interest: number
  principal: number
  payment: number
  balance: number
}

interface IUseInstallment {
  computeInstallmentSchedule: (values: InstallmentFormValues, startDate?: Date) => IInstallmentRow[]
  computeMonthlyPayment: (values: InstallmentFormValues) => number
  computeTotalInterest: (values: InstallmentFormValues) => number
}
export default function useInstallment (): IUseInstallment {
  function computeInstallmentSchedule (
    values: InstallmentFormValues,
    startDate: Date = new Date()
  ): IInstallmentRow[] {
    const { loanAmount, installmentCount: installments, interestType, annualInterestRate } = values
    if (!loanAmount || !installments || installments <= 0) return []

    const rows: IInstallmentRow[] = []
    const monthlyRate = annualInterestRate / 100 / 12

    if (interestType === 'FLAT_RATE') {
      const totalInterest = loanAmount * (annualInterestRate / 100) * (installments / 12)
      const principalPerPeriod = loanAmount / installments
      const interestPerPeriod = totalInterest / installments
      const payment = principalPerPeriod + interestPerPeriod
      let balance = loanAmount

      for (let i = 1; i <= installments; i++) {
        const due = new Date(startDate)
        due.setMonth(startDate.getMonth() + i)
        balance = Math.max(0, balance - principalPerPeriod)
        rows.push({
          period: i,
          dueDate: due.toISOString(),
          interest: interestPerPeriod,
          principal: principalPerPeriod,
          payment,
          balance
        })
      }
    } else {
    // Reducing balance
      const payment = monthlyRate === 0
        ? loanAmount / installments
        : (
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, installments))
          / (Math.pow(1 + monthlyRate, installments) - 1)
        )
      let balance = loanAmount

      for (let i = 1; i <= installments; i++) {
        const due = new Date(startDate)
        due.setMonth(startDate.getMonth() + i)
        const interest = balance * monthlyRate
        const principal = payment - interest
        balance = Math.max(0, balance - principal)
        rows.push({
          period: i,
          dueDate: due.toISOString(),
          interest,
          principal,
          payment,
          balance: i === installments ? 0 : balance
        })
      }
    }

    return rows
  }

  function computeMonthlyPayment (values: InstallmentFormValues): number {
    const { loanAmount, installmentCount: installments, interestType, annualInterestRate } = values
    if (!loanAmount || !installments || installments <= 0) return 0
    const monthlyRate = annualInterestRate / 100 / 12

    if (interestType === 'FLAT_RATE') {
      const totalInterest = loanAmount * (annualInterestRate / 100) * (installments / 12)
      return (loanAmount + totalInterest) / installments
    }
    if (monthlyRate === 0) return loanAmount / installments
    return (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, installments))
      / (Math.pow(1 + monthlyRate, installments) - 1)
    )
  }

  function computeTotalInterest (values: InstallmentFormValues): number {
    const { loanAmount, installmentCount: installments, interestType, annualInterestRate } = values
    if (!loanAmount || !installments || installments <= 0) return 0

    if (interestType === 'FLAT_RATE') {
      return loanAmount * (annualInterestRate / 100) * (installments / 12)
    }
    const monthlyRate = annualInterestRate / 100 / 12
    if (monthlyRate === 0) return 0
    const payment = (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, installments))
      / (Math.pow(1 + monthlyRate, installments) - 1)
    )
    return payment * installments - loanAmount
  }

  return {
    computeInstallmentSchedule,
    computeMonthlyPayment,
    computeTotalInterest
  }
}
