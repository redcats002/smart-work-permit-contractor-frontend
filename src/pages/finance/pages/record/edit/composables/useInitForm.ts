import type { Ref } from 'vue'
import type { IExpensesById, IExpensesFile } from '@/models/response/expenses/ExpensesRes.model'
import { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { ExpensesFormValues } from '../../create/schema/expenses.schema'

export function useInitForm (form: Ref<ExpensesFormValues>, data: IExpensesById): void {
  form.value = {
    type: (data.type as ExpensesTypeEnum) ?? ExpensesTypeEnum.GENERAL_INCOME,
    expenseCategoryId: data.expenseCategoryId ?? undefined,
    expenseTypeId: data.expenseTypeId ?? undefined,
    amount: data.amount ?? 0,
    expenseDate: data.expenseDate ?? '',
    reason: data.reason ?? '',
    referBranchId: data?.branch?.id ?? undefined,
    files: (data.files ?? []).map((f: IExpensesFile): IMedia => ({ name: f.name, url: f.url, path: f.path }))
  }
}
