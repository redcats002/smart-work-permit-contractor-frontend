<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    :items-footer="itemsFooter"
    disable-auto-left-padding
    show-footer
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ generator.generateOrder(index, pagination) }}
    </template>
    <template
      v-for="column in filteredColumnsForSlots"
      :key="`item.${column.field}`"
      #[`item.${column.field}`]="{ item }">
      <div class="grid gap-1">
        <span>{{ formatter.numberFormat2Decimal((item[column.field as keyof IAnnualFinanceReceiptList] as IAmountAndPercent)?.amount) }}</span>
        <span>{{ formatter.numberFormat2Decimal((item[column.field as keyof IAnnualFinanceReceiptList] as IAmountAndPercent)?.percent) }} %</span>
      </div>
    </template>
    <template
      v-for="column in filteredColumnsForSlots"
      :key="`footer.${column.field}`"
      #[`footer.${column.field}`]>
      <div class="grid gap-1">
        <span>
          {{ formatter.numberFormat2Decimal((summary?.[column.field as keyof IAnnualFinanceReceiptSummary] as IAmountAndPercent)?.amount) }}
        </span>
        <span>
          {{ formatter.numberFormat2Decimal((summary?.[column.field as keyof IAnnualFinanceReceiptSummary] as IAmountAndPercent)?.percent) }} %
        </span>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import { generator } from '@/utils/Generator'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import type {
  IAmountAndPercent,
  IAnnualFinanceReceiptList,
  IAnnualFinanceReceiptSummary
} from '@/models/response/report/annual-finance-receipt/AnnualFinanceReceiptRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import type { TAnnualFinanceReceiptType } from '@/enums/modules/report/annual-finance-receipt/AnnualFinanceReceipt.enum'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IAnnualFinanceReceiptList[]
  summary?: IAnnualFinanceReceiptSummary
  type?: TAnnualFinanceReceiptType
}

const props = withDefaults(defineProps<IProps>(), {
  summary: undefined,
  type: 'ALL'
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

const columns = ref<IColumn<IAnnualFinanceReceiptList>[]>([
  { field: 'index', header: 'ลำดับ' },
  { field: 'branch', header: 'สาขา', value: (e: IAnnualFinanceReceiptList): string => e.branch?.name },
  { field: 'january', header: 'มกราคม' },
  { field: 'february', header: 'กุมภาพันธ์' },
  { field: 'march', header: 'มีนาคม' },
  { field: 'april', header: 'เมษายน' },
  { field: 'may', header: 'พฤษภาคม' },
  { field: 'june', header: 'มิถุนายน' },
  { field: 'july', header: 'กรกฎาคม' },
  { field: 'august', header: 'สิงหาคม' },
  { field: 'september', header: 'กันยายน' },
  { field: 'october', header: 'ตุลาคม' },
  { field: 'november', header: 'พฤศจิกายน' },
  { field: 'december', header: 'ธันวาคม' },
  { field: 'total', header: 'รวมทั้งสิ้น' }
])

const filteredColumnsForSlots = computed((): IColumn<IAnnualFinanceReceiptList>[] => {
  if (props.type !== 'ALL') return []
  const notSlottedFields = ['index', 'branch']
  return columns.value.filter((column: IColumn<IAnnualFinanceReceiptList>): boolean => !notSlottedFields.includes(column.field))
})

const itemsFooter = computed((): IFooter[] => {
  let key: keyof IAmountAndPercent = 'amount'
  if (props.type === 'AMOUNT') key = 'amount'
  if (props.type === 'PERCENTAGE') key = 'percent'
  const footerConfig: Partial<Record<keyof IAnnualFinanceReceiptList, IFooterColConfig<IAnnualFinanceReceiptSummary>>> = {
    branch: { value: `รวม` },
    january: { value: formatter.numberFormat2Decimal(props.summary?.january?.[key] || 0) },
    february: { value: formatter.numberFormat2Decimal(props.summary?.february?.[key] || 0) },
    march: { value: formatter.numberFormat2Decimal(props.summary?.march?.[key] || 0) },
    april: { value: formatter.numberFormat2Decimal(props.summary?.april?.[key] || 0) },
    may: { value: formatter.numberFormat2Decimal(props.summary?.may?.[key] || 0) },
    june: { value: formatter.numberFormat2Decimal(props.summary?.june?.[key] || 0) },
    july: { value: formatter.numberFormat2Decimal(props.summary?.july?.[key] || 0) },
    august: { value: formatter.numberFormat2Decimal(props.summary?.august?.[key] || 0) },
    september: { value: formatter.numberFormat2Decimal(props.summary?.september?.[key] || 0) },
    october: { value: formatter.numberFormat2Decimal(props.summary?.october?.[key] || 0) },
    november: { value: formatter.numberFormat2Decimal(props.summary?.november?.[key] || 0) },
    december: { value: formatter.numberFormat2Decimal(props.summary?.december?.[key] || 0) },
    total: { value: formatter.numberFormat2Decimal(props.summary?.total?.[key] || 0) }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
