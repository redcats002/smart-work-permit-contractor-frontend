import type { ICreateExpensesPayload } from '@/models/request/expenses/ExpensesReq.model'
import { isPaymentExpense } from '@/enums/modules/finance/ExpenseType.enum'
import type { ExpensesFormValues } from '../schema/expenses.schema'

export function usePayload (form: ExpensesFormValues): ICreateExpensesPayload {
  const paymentPayload: ICreateExpensesPayload = {
    type: form.type,
    expenseTypeId: form.expenseTypeId,
    expenseCategoryId: form.expenseCategoryId,
    amount: form.amount,
    expenseDate: form.expenseDate,
    files: form.files,
    reason: form.reason ?? ''
  }
  if (isPaymentExpense(form.type)) return paymentPayload
  const capitalPayload: ICreateExpensesPayload = {
    type: form.type,
    referBranchId: form.referBranchId,
    expenseDate: form.expenseDate,
    amount: form.amount,
    files: form.files,
    reason: form.reason ?? ''
  }
  return capitalPayload
}
