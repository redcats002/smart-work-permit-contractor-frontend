import { ref, type Ref } from 'vue'
import type { IContractExpenseById } from '@/models/response/contract-expense/ContractExpenseRes.model'

export function useInitDetail (data?: Partial<IContractExpenseById>): Ref<IContractExpenseById> {
  return ref<IContractExpenseById>({
    id: data?.id ?? 0,
    contractId: data?.contractId ?? null,
    expenseCategory: data?.expenseCategory ?? {
      id: 0,
      name: '',
      externalInternalExpense: 'EXTERNAL'
    },
    expenseType: data?.expenseType ?? {
      id: 0,
      name: ''
    },
    note: data?.note ?? '',
    amount: data?.amount ?? 0,
    vatType: data?.vatType ?? 'VAT',
    file: data?.file ?? [],
    ...data
  })
}
