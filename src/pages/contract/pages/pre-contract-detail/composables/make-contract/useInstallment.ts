import { type InterestTypeEnum } from '@/enums/modules/contract/InterestType.enum'
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
  const installments: IInstallmentRow[] = []
  const { loanAmount, installmentCount, interestType, annualInterestRate, contractedAt } = operation

  const dayAt = Number(dayjs(contractedAt).format('D'))
  const startFirstInstallment = dayjs(contractedAt).date(dayAt >= 28 ? 28 : dayAt).startOf('day')

  let remainingPrincipal = loanAmount

  if (interestType === 'FLAT_RATE') {
    const totalInterest = Math.round(loanAmount * (annualInterestRate / 100) * (installmentCount / 12))
    const principalPerInstallment = loanAmount / installmentCount
    const interestPerInstallment = totalInterest / installmentCount

    let sumPrincipal = 0
    let sumInterest = 0

    for (let i = 0; i < installmentCount; i++) {
      const isLast = i === installmentCount - 1

      const principal = isLast ? loanAmount - sumPrincipal : Math.round(principalPerInstallment)
      const interest = isLast ? totalInterest - sumInterest : Math.round(interestPerInstallment)

      sumPrincipal += principal
      sumInterest += interest
      remainingPrincipal = Math.round(remainingPrincipal - principal)

      installments.push({
        order: i + 1,
        dueDate: startFirstInstallment.add(i + 1, 'month').toISOString(),
        interest,
        outstandingInterest: interest,
        principal,
        outstandingPrincipal: principal,
        installment: interest + principal,
        remainingPrincipal
      })
    }
  } else if (interestType === 'EFFECTIVE_RATE') {
    throw new Error('กำลังปรับปรุงวิธีคำนวณ ลดต้นลดดอก')
  }

  return installments
}
