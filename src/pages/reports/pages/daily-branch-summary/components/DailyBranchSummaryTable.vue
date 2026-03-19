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
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import type { IDailyBranchSummaryList } from '@/models/response/report/daily-branch-summary/DailyBranchSummaryRes.model'

interface IProps {
  items: IDailyBranchSummaryList[]
}

const props = defineProps<IProps>()


const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IDailyBranchSummaryList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', width: 150 },
  { field: 'financeReceive', header: 'รับไฟแนนซ์', align: 'right', width: 120, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.financeReceive) },
  { field: 'financeRelease', header: 'ปล่อยไฟแนนซ์', align: 'left', width: 120, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.financeRelease) },
  { field: 'processingFee', header: 'ค่าดำเนินการ', align: 'left', width: 120, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.processingFee) },
  { field: 'sell', header: 'ขาย', align: 'left', width: 120, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.sell) },
  { field: 'insuranceCost', header: 'เงินประกัน', align: 'left', width: 120, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.insuranceCost) },
  { field: 'cancellationCost', header: 'ยกเลิกสัญญา', align: 'left', width: 140, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.cancellationCost) },
  { field: 'lawyerFee', header: 'ค่าทนาย', align: 'left', width: 100, value: (e: IDailyBranchSummaryList): string => `${formatter.numberFormat(e.lawyerFee)}` },
  { field: 'contractReplacementFee', header: 'เปลี่ยนสัญญา', align: 'left', width: 100, value: (e: IDailyBranchSummaryList): string => `${formatter.numberFormat(e.contractReplacementFee)}` },
  { field: 'remainingBalance', header: 'เงินคงเหลือ', align: 'left', width: 100, value: (e: IDailyBranchSummaryList): string => `${formatter.numberFormat(e.remainingBalance)}` }
])
</script>

<style scoped></style>
