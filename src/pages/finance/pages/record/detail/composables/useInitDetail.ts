import { ref, type Ref } from 'vue'
import type { IExpensesById } from '@/models/response/expenses/ExpensesRes.model'
import { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'

export function useInitDetail (data?: Partial<IExpensesById>): Ref<IExpensesById> {
  return ref<IExpensesById>({
    ...data,
    id: data?.id ?? 0,
    expenseNo: data?.expenseNo ?? '',
    expensesType: data?.expensesType ?? ExpensesTypeEnum.PAY,
    date: data?.date ?? '',
    type: data?.type ?? '',
    category: data?.category ?? '',
    note: data?.note ?? '',
    totalValue: data?.totalValue ?? 0,
    files: data?.files ?? []
  })
}
