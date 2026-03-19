<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

import type { IFinancialSummaryReportList } from '@/models/response/report/financial-summary/FinancialSummaryRes.model'
import { formatter } from '@/utils/Formatter'

interface IProps {
  items: IFinancialSummaryReportList[]
}

const props = defineProps<IProps>()
interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IFinancialSummaryReportList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', width: 150 },
  { field: 'income', header: 'รายรับ', align: 'left', width: 120, value: (e: IFinancialSummaryReportList): string => e.income ? formatter.numberFormat2Decimal(e.income) : '-' },
  { field: 'loan', header: 'ปล่อยสินเชื่อ', align: 'left', width: 120, value: (e: IFinancialSummaryReportList): number => e.loan },
  { field: 'expenses', header: 'รายจ่าย', align: 'left', width: 120, value: (e: IFinancialSummaryReportList): string => e.expenses ? formatter.numberFormat2Decimal(e.expenses) : '-' }
])
</script>

<style scoped></style>
