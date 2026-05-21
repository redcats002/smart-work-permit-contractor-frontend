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
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IRankLoanItem } from '@/models/response/report/rank-loan/RankLoanRes.model'
import type { IColumn } from '@/models/Table.model'
import { RankingLoanTypeEnum } from '@/enums/modules/report/RankingLoan.enum'
import BaseTable from '@/components/table/BaseTable.vue'

interface IProps {
  items: IRankLoanItem[]
  type?: string
}

const props = defineProps<IProps>()

const isPercent = computed((): boolean => props.type === RankingLoanTypeEnum.PERCENTAGE)

const columns = computed((): IColumn<IRankLoanItem>[] => [
  { field: 'index', header: 'ลำดับ', align: 'left', width: 60 },
  { field: 'branch', header: 'สาขา', align: 'left', width: 150, value: (e: IRankLoanItem): string => e.branch?.name || '-' },
  { field: 'branch', header: 'เลขที่สาขา', align: 'left', width: 120, value: (e: IRankLoanItem): string => e.branch?.idNo || '-' },
  { field: 'paidAmount' as keyof IRankLoanItem, header: 'ยอดรับ', align: 'right' as const, width: 130, value: (e: IRankLoanItem): string => isPercent.value ? `${formatter.numberFormat(e.percent)}%` : formatter.numberFormat(e.paidAmount) },
  { field: 'topCount', header: 'ติด TOP ครั้งที่', align: 'center', width: 120, value: (e: IRankLoanItem): string => formatter.numberFormat(e.topCount) }
])

</script>

<style scoped></style>
