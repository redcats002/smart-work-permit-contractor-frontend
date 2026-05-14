import type { Ref } from 'vue'
import type { IExpensesById, IExpensesFile } from '@/models/response/expenses/ExpensesRes.model'
import { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { ExpensesFormValues } from '../../create/schema/expenses.schema'

export function useInitForm (form: Ref<ExpensesFormValues>, data: IExpensesById): void {
  form.value.expensesType = (data.type as ExpensesTypeEnum) ?? ExpensesTypeEnum.PAY
  form.value.categoryId = data.expenseCategoryId ?? undefined
  form.value.expensesId = data.expenseTypeId ?? undefined
  form.value.amount = data.amount ?? 0
  form.value.payDate = data.expenseDate ?? ''
  form.value.note = data.reason ?? ''
  form.value.files = (data.files ?? []).map((f: IExpensesFile): IMedia => ({ name: f.name, url: f.url, path: f.path }))
}
