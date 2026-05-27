import type { IUpdateExpensesPayload } from '@/models/request/expenses/ExpensesReq.model'
import { isPaymentExpense } from '@/enums/modules/finance/ExpenseType.enum'
import type { ExpensesFormValues } from '../../create/schema/expenses.schema'

export function usePayload (form: ExpensesFormValues): IUpdateExpensesPayload {
  const paymentPayload: IUpdateExpensesPayload = {
    type: form.type,
    expenseTypeId: form.expenseTypeId,
    expenseCategoryId: form.expenseCategoryId,
    amount: form.amount,
    expenseDate: form.expenseDate,
    files: form.files,
    reason: form.reason ?? ''
  }
  if (isPaymentExpense(form.type)) return paymentPayload
  const capitalPayload: IUpdateExpensesPayload = {
    type: form.type,
    branchId: form.branchId,
    expenseDate: form.expenseDate,
    amount: form.amount,
    files: form.files,
    reason: form.reason ?? ''
  }
  return capitalPayload
}
