import { schema } from '@/utils/Schema'
import { InterestTypeEnum } from '@/enums/modules/contract/InterestType.enum'
import { z } from 'zod'

export const PreAssetWarehouseSchema = z.object({
  id: schema.id('รหัสสินทรัพย์'),
  files: z.array(z.object({
    name: z.string(),
    path: z.string(),
    url: z.string()
  })).optional(),
  locationId: schema.id('จุดจัดเก็บ')
})

export const PreAssetWarehouseListSchema = z.array(PreAssetWarehouseSchema)

export const InstallmentSchema = z.object({
  loanAmount: z.number().optional(), // for display purpose only, not required in payload
  lateFee: z.number().optional(), // for display purpose only, not required in payload
  installmentCount: z.number({ message: 'กรุณากรอกจำนวนงวด' }).min(1, 'กรุณากรอกจำนวนงวด'),
  annualInterestRate: z.number({ message: 'กรุณากรอกอัตราดอกเบี้ย' }).min(0, 'กรุณากรอกอัตราดอกเบี้ย'),
  interestType: schema.enum(InterestTypeEnum, 'ประเภทดอกเบี้ย')
})
export const MakeContractSchema = z.object({
  ...InstallmentSchema.shape,
  preAssets: PreAssetWarehouseListSchema
})

export type PreAssetWarehouseFormValues = z.infer<typeof PreAssetWarehouseSchema>
export type PreAssetWarehouseListFormValues = z.infer<typeof PreAssetWarehouseListSchema>
export type InstallmentFormValues = z.infer<typeof InstallmentSchema>
export type MakeContractFormValues = z.infer<typeof MakeContractSchema>

export function useFormInitialValues (): MakeContractFormValues {
  return {
    loanAmount: 0,
    lateFee: 0,
    installmentCount: 0,
    interestType: 'FLAT_RATE',
    annualInterestRate: 0,
    preAssets: []
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

export function computeMonthlyPayment (values: InstallmentFormValues): number {
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

export function computeTotalInterest (values: InstallmentFormValues): number {
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
