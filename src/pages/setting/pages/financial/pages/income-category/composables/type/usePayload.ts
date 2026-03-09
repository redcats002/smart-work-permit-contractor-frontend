import type { ICreateFinanceIncomeTypePayload, IUpdateFinanceIncomeTypePayload } from '@/models/request/finance-income-category/FinanceIncomeCategoryReq.model'
import type { FinanceIncomeTypeFormValues } from '../../schema/finance-income-type.schema'

export function useCreatePayload (form: FinanceIncomeTypeFormValues): ICreateFinanceIncomeTypePayload {
  return {
    ...form,
    incomeCategoryId: form.incomeCategoryId || undefined
  }
}
export function useUpdatePayload (form: FinanceIncomeTypeFormValues): IUpdateFinanceIncomeTypePayload {
  return {
    ...form,
    incomeCategoryId: form.incomeCategoryId || undefined
  }
}
