import { z } from 'zod'

export const InterestTypeEnum = {
  FLAT: 'FLAT',
  REDUCING: 'REDUCING'
} as const

export type TInterestType = keyof typeof InterestTypeEnum

export const InstallmentSchema = z.object({
  loanAmount: z.number({ message: 'กรุณากรอกจำนวนเงิน' }).min(1, 'กรุณากรอกจำนวนเงิน'),
  installments: z.number({ message: 'กรุณากรอกจำนวนงวด' }).int().min(1, 'กรุณากรอกจำนวนงวด'),
  interestType: z.enum(['FLAT', 'REDUCING'], { message: 'กรุณาเลือกประเภทดอกเบี้ย' }),
  annualInterestRate: z.number({ message: 'กรุณากรอกอัตราดอกเบี้ย' }).min(0, 'กรุณากรอกอัตราดอกเบี้ย'),
  lateFee: z.number({ message: 'กรุณากรอกค่าปรับ' }).min(0, 'กรุณากรอกค่าปรับ')
})

export type InstallmentFormValues = z.infer<typeof InstallmentSchema>

export function useFormInitialValues (): InstallmentFormValues {
  return {
    loanAmount: 0,
    installments: 0,
    interestType: 'FLAT',
    annualInterestRate: 0,
    lateFee: 0
  }
}

export interface IInstallmentRow {
  period: number
  dueDate: string
  interest: number
  principal: number
  payment: number
  balance: number
}

export function computeInstallmentSchedule (
  values: InstallmentFormValues,
  startDate: Date = new Date()
): IInstallmentRow[] {
  const { loanAmount, installments, interestType, annualInterestRate } = values
  if (!loanAmount || !installments || installments <= 0) return []

  const rows: IInstallmentRow[] = []
  const monthlyRate = annualInterestRate / 100 / 12

  if (interestType === 'FLAT') {
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

export function computeMonthlyPayment (values: InstallmentFormValues): number {
  const { loanAmount, installments, interestType, annualInterestRate } = values
  if (!loanAmount || !installments || installments <= 0) return 0
  const monthlyRate = annualInterestRate / 100 / 12

  if (interestType === 'FLAT') {
    const totalInterest = loanAmount * (annualInterestRate / 100) * (installments / 12)
    return (loanAmount + totalInterest) / installments
  }
  if (monthlyRate === 0) return loanAmount / installments
  return (
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, installments))
    / (Math.pow(1 + monthlyRate, installments) - 1)
  )
}

export function computeTotalInterest (values: InstallmentFormValues): number {
  const { loanAmount, installments, interestType, annualInterestRate } = values
  if (!loanAmount || !installments || installments <= 0) return 0

  if (interestType === 'FLAT') {
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
