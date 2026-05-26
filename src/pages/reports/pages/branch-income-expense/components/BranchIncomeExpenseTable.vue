<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IBranchIncomeExpenseSummaryDisplay } from '@/models/modules/report/branch-income-expense/Summary.model'
import type { IBranchIncomeExpenseList, IBranchIncomeExpenseSummary } from '@/models/response/report/branch-income-expense/BranchIncomeExpenseRes.model'
import type { IColumn } from '@/models/Table.model'
import type { TFinanceCategory } from '@/enums/modules/report/branch-income-expense/FinanceCategory.enum'
import type { TTransactionType } from '@/enums/modules/report/branch-income-expense/TransactionType.enum'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IBranchIncomeExpenseList[]
  summary?: IBranchIncomeExpenseSummary
  transactionType?: TTransactionType
  financeCategory?: TFinanceCategory
}

const props = withDefaults(defineProps<IProps>(), {
  summary: undefined,
  transactionType: undefined,
  financeCategory: undefined
})

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = computed((): IColumn<IBranchIncomeExpenseList>[] => {
  const base: IColumn<IBranchIncomeExpenseList>[] = [
    { field: 'index', header: 'ลำดับ', style: { width: '70px', minWidth: '70px' } },
    { field: 'idNo', header: 'รหัสการชำระ', style: { width: '130px', minWidth: '130px' } },
    { field: 'category', header: 'หมวดหมู่', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IBranchIncomeExpenseList): string => e?.category?.name }
  ]
  switch (props.transactionType) {
    case 'INCOME_EXPENSE':
      base.push({ field: 'income', header: 'รายรับ', style: { width: '140px', minWidth: '140px' } })
      base.push({ field: 'expense', header: 'รายจ่าย', style: { width: '140px', minWidth: '140px' } })
      break
    case 'INCOME':
      base.push({ field: 'income', header: 'รายรับ', style: { width: '140px', minWidth: '140px' } })
      break
    case 'EXPENSE':
      base.push({ field: 'expense', header: 'รายจ่าย', style: { width: '140px', minWidth: '140px' } })
      break
    case 'INCREASE_REPAYMENT':
      base.push({ field: 'income', header: 'รับทุน', style: { width: '140px', minWidth: '140px' } })
      base.push({ field: 'expense', header: 'จ่ายทุน', style: { width: '140px', minWidth: '140px' } })
      break
    case 'INCREASE':
      base.push({ field: 'income', header: 'รับทุน', style: { width: '140px', minWidth: '140px' } })
      base.push({ field: 'expense', header: 'จ่ายทุน', style: { width: '140px', minWidth: '140px' } })
      break
    case 'REPAYMENT':
      base.push({ field: 'expense', header: 'จ่ายทุน', style: { width: '140px', minWidth: '140px' } })
      break
    default:
      break
  }
  return base
})

// TODO: Summary
computed((): Partial<IBranchIncomeExpenseSummaryDisplay> => ({}))
</script>

<style scoped></style>
