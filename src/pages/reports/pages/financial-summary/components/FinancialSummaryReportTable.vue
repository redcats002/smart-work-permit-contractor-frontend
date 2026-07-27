<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    :items-footer="itemsFooter"
    disable-auto-left-padding
    show-footer
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import type { IFinancialSummaryReportList, IFinancialSummaryReportSummary } from '@/models/response/report/financial-summary/FinancialSummaryRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import { FinancialSummaryTypeEnum, type TFinancialSummaryType } from '@/enums/modules/report/financial-summary/FinancialSummaryType.enum'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IFinancialSummaryReportList[]
  summary?: IFinancialSummaryReportSummary
  type?: TFinancialSummaryType
}

const props = withDefaults(defineProps<IProps>(), {
  summary: undefined,
  type: FinancialSummaryTypeEnum.SUMMARY
})

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const baseColumns = ref<IColumn<IFinancialSummaryReportList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', style: { width: '70px', minWidth: '70px' }, width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' } }
])

const incomeColumn: IColumn<IFinancialSummaryReportList> = {
  field: 'income',
  header: 'รายรับ',
  align: 'right',
  style: { width: '140px', minWidth: '140px' },
  value: (e: IFinancialSummaryReportList): string => e.income ? formatter.numberFormat2Decimal(e.income) : '-'
}
const principalColumn: IColumn<IFinancialSummaryReportList> = {
  field: 'principal',
  header: 'ปล่อยสินเชื่อ',
  align: 'right',
  style: { width: '140px', minWidth: '140px' },
  value: (e: IFinancialSummaryReportList): string => formatter.numberFormat2Decimal(e.principal)
}
const expensesColumn: IColumn<IFinancialSummaryReportList> = {
  field: 'expenses',
  header: 'รายจ่าย',
  align: 'right',
  style: { width: '140px', minWidth: '140px' },
  value: (e: IFinancialSummaryReportList): string => e.expenses ? formatter.numberFormat2Decimal(e.expenses) : '-'
}

const columns = computed((): IColumn<IFinancialSummaryReportList>[] => {
  const extra: IColumn<IFinancialSummaryReportList>[] = {
    [FinancialSummaryTypeEnum.SUMMARY]: [incomeColumn, principalColumn, expensesColumn],
    [FinancialSummaryTypeEnum.INCOME]: [incomeColumn],
    [FinancialSummaryTypeEnum.PRINCIPAL]: [principalColumn],
    [FinancialSummaryTypeEnum.EXPENSES]: [expensesColumn]
  }[props.type ?? FinancialSummaryTypeEnum.SUMMARY]
  return [...baseColumns.value, ...extra]
})

const footerStyle = 'height: 80px; padding: 9px 16px;'
const footerClass = 'text-right font-bold'

const itemsFooter = computed((): IFooter[] => {
  const footerConfig: Partial<Record<keyof IFinancialSummaryReportList, IFooterColConfig<IFinancialSummaryReportSummary>>> = {
    income: { value: `ยอดรับทั้งหมด ${formatter.numberFormat2Decimal(props.summary?.income || 0)}`, footerClass, footerStyle },
    principal: { value: `ยอดปล่อยสินเชื่อทั้งหมด ${formatter.numberFormat2Decimal(props.summary?.principal || 0)}`, footerClass, footerStyle },
    expenses: { value: `ยอดจ่ายทั้งหมด ${formatter.numberFormat2Decimal(props.summary?.expenses || 0)}`, footerClass, footerStyle }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
