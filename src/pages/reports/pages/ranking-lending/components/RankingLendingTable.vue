<template>
  <BaseTable
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    hide-pagination>
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IRankLendingItem } from '@/models/response/report/rank-lending/RankLendingRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'

interface IProps {
  items: IRankLendingItem[]
}

const props = defineProps<IProps>()

const columns = ref<IColumn<IRankLendingItem>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', style: { width: '70px', minWidth: '70px' }, width: 60 },
  { field: 'branch', header: 'สาขา', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, width: 150, value: (e: IRankLendingItem): string => e.branch?.name || '-' },
  { field: 'idNo', header: 'เลขที่สาขา', align: 'left', style: { width: '130px', minWidth: '130px' }, width: 120, value: (e: IRankLendingItem): string => e.branch?.idNo || '-' },
  { field: 'amount', header: 'ยอดปล่อยสินเชื่อ', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 140, value: (e: IRankLendingItem): string => formatter.numberFormat2Decimal(e.amount) },
  { field: 'topCount', header: 'ติด TOP ครั้งที่', align: 'center', style: { width: '70px', minWidth: '70px' }, width: 120, value: (e: IRankLendingItem): string => formatter.numberFormat(e.topCount) }
])
</script>

<style scoped></style>
