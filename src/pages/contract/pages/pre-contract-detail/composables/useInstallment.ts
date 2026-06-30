import { InterestTypeEnum } from '@/enums/modules/contract/InterestType.enum'
import dayjs from 'dayjs'

export interface IInstallmentRow {
  order: number
  dueDate: string
  interest: number
  outstandingInterest: number
  principal: number
  outstandingPrincipal: number
  installment: number
  remainingPrincipal: number
}

export interface IOperationInstallment {
  loanAmount: number
  installmentCount: number
  interestType: InterestTypeEnum
  annualInterestRate: number
  contractedAt: Date
}

export function useInstallment (operation: IOperationInstallment): IInstallmentRow[] {
  const { loanAmount, installmentCount, interestType, annualInterestRate, contractedAt } = operation
  if (!loanAmount || !installmentCount || installmentCount <= 0) return []

  const dayAt = Number(dayjs(contractedAt).format('D'))
  const startFirstInstallment = dayjs(contractedAt).date(dayAt >= 28 ? 28 : dayAt).startOf('day')

  const installments: IInstallmentRow[] = []
  let remainingPrincipal = loanAmount

  if (interestType === InterestTypeEnum.FLAT_RATE) {
    const totalInterest = loanAmount * (annualInterestRate / 100) * (installmentCount / 12)
    const interest = totalInterest / installmentCount
    const principal = loanAmount / installmentCount

    for (let i = 0; i < installmentCount; i++) {
      remainingPrincipal -= principal
      installments.push({
        order: i + 1,
        dueDate: startFirstInstallment.add(i + 1, 'month').toISOString(),
        interest,
        outstandingInterest: interest,
        principal,
        outstandingPrincipal: principal,
        installment: interest + principal,
        remainingPrincipal: Math.max(0, remainingPrincipal)
      })
    }
  } else if (interestType === InterestTypeEnum.EFFECTIVE_RATE) {
    throw new Error('กำลังปรับปรุงวิธีคำนวณ ลดต้นลดดอก')
  }

  return installments
}
