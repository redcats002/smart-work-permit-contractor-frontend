import type { ICreateFinanceExpenseTypePayload, IUpdateFinanceExpenseTypePayload } from '@/models/request/finance-expense-type/FinanceExpenseTypeReq.model'
import type { FinanceExpenseTypeFormValues } from '../../schema/finance-expense-type.schema'

export function useCreatePayload (form: FinanceExpenseTypeFormValues): ICreateFinanceExpenseTypePayload {
  return {
    ...form,
    expenseCategoryId: form.expenseCategoryId || undefined
  }
}
export function useUpdatePayload (form: FinanceExpenseTypeFormValues): IUpdateFinanceExpenseTypePayload {
  return {
    ...form,
    expenseCategoryId: form.expenseCategoryId || undefined
  }
}
