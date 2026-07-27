<template>
  <BaseTable
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    :items-footer="itemsFooter"
    disable-auto-left-padding
    hide-pagination
    show-footer
    @update="emits('update')" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { TBranchIncomeExpenseCategoryFilter } from '@/models/modules/report/branch-income-expense/Filter.model'
import type { IBranchIncomeExpenseCodeSummary, IBranchIncomeExpenseItem } from '@/models/response/report/branch-income-expense/BranchIncomeExpenseRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import {
  REPORT_TYPE_COL1_FOOTER_LABEL,
  REPORT_TYPE_COL1_LABEL,
  REPORT_TYPE_COL1_TYPES,
  REPORT_TYPE_COL2_FOOTER_LABEL,
  REPORT_TYPE_COL2_LABEL,
  REPORT_TYPE_COL2_TYPES,
  ReportTypeEnum,
  type TReportType
} from '@/enums/modules/report/branch-income-expense/ReportType.enum'
import BaseTable from '@/components/table/BaseTable.vue'

interface IProps {
  items: IBranchIncomeExpenseItem[]
  summary?: IBranchIncomeExpenseCodeSummary
  reportType?: TReportType
  financeCategory?: TBranchIncomeExpenseCategoryFilter
}

const props = withDefaults(defineProps<IProps>(), {
  summary: undefined,
  reportType: ReportTypeEnum.RECEIVE_REFUND,
  financeCategory: 'OVERALL'
})

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const dayjs = useDayjs()

const activeReportType = computed((): TReportType => props.reportType || ReportTypeEnum.RECEIVE_REFUND)

const col1Types = computed((): string[] => REPORT_TYPE_COL1_TYPES[activeReportType.value] || [])
const col2Types = computed((): string[] => REPORT_TYPE_COL2_TYPES[activeReportType.value] || [])
const col1Label = computed((): string => REPORT_TYPE_COL1_LABEL[activeReportType.value])
const col2Label = computed((): string => REPORT_TYPE_COL2_LABEL[activeReportType.value])
const col1FooterLabel = computed((): string => REPORT_TYPE_COL1_FOOTER_LABEL[activeReportType.value])
const col2FooterLabel = computed((): string => REPORT_TYPE_COL2_FOOTER_LABEL[activeReportType.value])

const totalCol1 = computed((): number =>
  props.items
    .filter((i: IBranchIncomeExpenseItem): boolean => col1Types.value.includes(i.type))
    .reduce((sum: number, i: IBranchIncomeExpenseItem): number => sum + (i.amount || 0), 0)
)

const totalCol2 = computed((): number =>
  props.items
    .filter((i: IBranchIncomeExpenseItem): boolean => col2Types.value.includes(i.type))
    .reduce((sum: number, i: IBranchIncomeExpenseItem): number => sum + (i.amount || 0), 0)
)

const isReceiveRefund = computed((): boolean => activeReportType.value === ReportTypeEnum.RECEIVE_REFUND)
const showCol1 = computed((): boolean => props.financeCategory !== 'COL2')
const showCol2 = computed((): boolean => props.financeCategory !== 'COL1')

const columns = computed((): IColumn<IBranchIncomeExpenseItem>[] => {
  const col1AmountFn = (e: IBranchIncomeExpenseItem): string | null =>
    col1Types.value.includes(e.type) ? formatter.numberFormat2Decimal(e.amount) : null

  const col2AmountFn = (e: IBranchIncomeExpenseItem): string | null =>
    col2Types.value.includes(e.type) ? formatter.numberFormat2Decimal(e.amount) : null

  const col1Col: IColumn<IBranchIncomeExpenseItem> = { field: 'col1', header: col1Label.value, align: 'right', style: { width: '150px', minWidth: '150px' }, value: col1AmountFn }
  const col2Col: IColumn<IBranchIncomeExpenseItem> = { field: 'col2', header: col2Label.value, align: 'right', style: { width: '150px', minWidth: '150px' }, value: col2AmountFn }

  const dateFmt = (e: IBranchIncomeExpenseItem): string => dayjs.formatDate(e.date)

  if (isReceiveRefund.value) {
    return [
      { field: 'date', header: 'วันที่', sortable: true, style: { width: '120px', minWidth: '120px' }, value: dateFmt },
      { field: 'code', header: 'รหัสการชำระ', style: { width: '140px', minWidth: '140px' } },
      ...(showCol1.value ? [col1Col] : []),
      ...(showCol2.value ? [col2Col] : [])
    ]
  }

  return [
    { field: 'date', header: 'วันที่', sortable: true, style: { width: '120px', minWidth: '120px' }, value: dateFmt },
    { field: 'code', header: 'รหัสการชำระ', style: { width: '140px', minWidth: '140px' } },
    { field: 'referBranchName', header: 'สาขา', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' } },
    ...(showCol1.value ? [col1Col] : []),
    ...(showCol2.value ? [col2Col] : [])
  ]
})

const itemsFooter = computed((): IFooter[] => {
  const emptySpan = isReceiveRefund.value ? 2 : 3
  const footer: IFooter[] = [{ colspan: emptySpan, field: 'empty', value: '' }]
  if (showCol1.value) {
    footer.push({
      colspan: 1,
      field: 'col1',
      value: `${col1FooterLabel.value} ${formatter.numberFormat2Decimal(totalCol1.value)}`,
      footerClass: 'text-right font-bold'
    })
  }
  if (showCol2.value) {
    footer.push({
      colspan: 1,
      field: 'col2',
      value: `${col2FooterLabel.value} ${formatter.numberFormat2Decimal(totalCol2.value)}`,
      footerClass: 'text-right font-bold'
    })
  }
  return footer
})
</script>

<style scoped></style>
