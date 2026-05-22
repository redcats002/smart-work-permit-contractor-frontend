import { ref, type Ref } from 'vue'
import type { IContractIncomeById } from '@/models/response/contract-income/ContractIncomeRes.model'

export function useInitDetail (data?: Partial<IContractIncomeById>): Ref<IContractIncomeById> {
  return ref<IContractIncomeById>({
    id: data?.id ?? 0,
    contractId: data?.contractId ?? null,
    incomeCategory: data?.incomeCategory ?? {
      id: 0,
      name: ''
    },
    incomeType: data?.incomeType ?? {
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
