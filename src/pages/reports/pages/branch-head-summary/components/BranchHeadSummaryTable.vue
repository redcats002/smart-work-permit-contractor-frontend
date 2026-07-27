<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding>
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
    <template #[`item.percentReceive`]="{ item }">
      <span
        :class="item.percentReceive ? 'text-green-500' : 'text-red-400'">
        {{
          item.percentReceive
            ? formatter.numberFormat2Decimal(item.percentReceive)
            : 'ไม่นับยอดเก็บ'
        }}
      </span>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IBranchHeadSummaryList } from '@/models/response/report/branch-head-summary/BranchHeadSummaryRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IBranchHeadSummaryList[]
}

const props = defineProps<IProps>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IBranchHeadSummaryList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', style: { width: '70px', minWidth: '70px' }, width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, width: 150 },
  { field: 'monthlyInstallment', header: 'ค่างวดต่องวด', align: 'left', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: IBranchHeadSummaryList): string => formatter.numberFormat2Decimal(e.monthlyInstallment) },
  { field: 'percentReceive', header: 'การคิด%ยอดเก็บ', align: 'left', style: { width: '100px', minWidth: '100px' }, width: 120 },
  { field: 'receiveAmount', header: 'ยอดเก็บ', align: 'left', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: IBranchHeadSummaryList): string => formatter.numberFormat2Decimal(e.receiveAmount) },
  { field: 'principal', header: 'ยอดปล่อย', align: 'left', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: IBranchHeadSummaryList): string => formatter.numberFormat2Decimal(e.principal) }
])
</script>

<style scoped></style>
