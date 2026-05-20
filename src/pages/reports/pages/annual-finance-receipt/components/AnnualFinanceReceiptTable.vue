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
      v-for="col in monthColumns"
      :key="`item.${col.field}`"
      #[`item.${col.field}`]="{ item }">
      <div class="grid gap-1">
        <span>{{ formatter.numberFormat2Decimal((item[col.field as keyof IAnnualFinanceReceiptList] as IMonthData)?.principalAndInterest) }}</span>
        <span>{{ formatter.numberFormat2Decimal((item[col.field as keyof IAnnualFinanceReceiptList] as IMonthData)?.percent) }} %</span>
      </div>
    </template>
    <template
      v-for="col in monthColumns"
      :key="`footer.${col.field}`"
      #[`footer.${col.field}`]>
      <div class="grid gap-1">
        <span>
          {{ formatter.numberFormat2Decimal((summary?.[col.field as keyof IAnnualFinanceReceiptSummary] as IMonthData)?.principalAndInterest) }}
        </span>
        <span>
          {{ formatter.numberFormat2Decimal((summary?.[col.field as keyof IAnnualFinanceReceiptSummary] as IMonthData)?.percent) }} %
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
  IAnnualFinanceReceiptList,
  IAnnualFinanceReceiptSummary,
  IMonthData
} from '@/models/response/report/annual-finance-receipt/AnnualFinanceReceiptRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IAnnualFinanceReceiptList[]
  summary?: IAnnualFinanceReceiptSummary
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IAnnualFinanceReceiptList>[]>([
  { field: 'index', header: 'ลำดับ', width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', width: 160 },
  { field: 'month1', header: 'ม.ค.' },
  { field: 'month2', header: 'ก.พ.' },
  { field: 'month3', header: 'มี.ค.' },
  { field: 'month4', header: 'เม.ย.' },
  { field: 'month5', header: 'พ.ค.' },
  { field: 'month6', header: 'มิ.ย.' },
  { field: 'month7', header: 'ก.ค.' },
  { field: 'month8', header: 'ส.ค.' },
  { field: 'month9', header: 'ก.ย.' },
  { field: 'month10', header: 'ต.ค.' },
  { field: 'month11', header: 'พ.ย.' },
  { field: 'month12', header: 'ธ.ค.' },
  { field: 'sumMonth', header: 'รวมทั้งสิ้น' }
])

const monthColumns = computed((): IColumn<IAnnualFinanceReceiptList>[] => {
  const skipFields = ['index', 'branchName']
  return columns.value.filter((col: IColumn<IAnnualFinanceReceiptList>): boolean => !skipFields.includes(col.field))
})

const itemsFooter = computed((): IFooter[] => {
  const footerConfig: Partial<Record<keyof IAnnualFinanceReceiptList, IFooterColConfig<IAnnualFinanceReceiptSummary>>> = {
    branchName: { value: `รวม ${pagination.value.count || 0} สาขา` }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
