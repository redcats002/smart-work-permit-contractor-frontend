import { ref, type Ref } from 'vue'
import { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import type { IExpensesById } from '@/models/response/expenses/ExpensesRes.model'

export function useInitDetail (data?: Partial<IExpensesById>): Ref<IExpensesById> {
  return ref<IExpensesById>({
    ...data,
    id: data?.id ?? 0,
    idNo: data?.idNo ?? '',
    createdAt: data?.createdAt ?? '',
    expenseDate: data?.expenseDate ?? '',
    amount: data?.amount ?? 0,
    createdBy: data?.createdBy ?? '',
    type: data?.type ?? ExpensesTypeEnum.PAY,
    expenseTypeId: data?.expenseTypeId ?? 0,
    expenseType: data?.expenseType ?? '',
    expenseCategoryId: data?.expenseCategoryId ?? 0,
    expenseCategory: data?.expenseCategory ?? '',
    reason: data?.reason ?? '',
    files: data?.files ?? []
  })
}
