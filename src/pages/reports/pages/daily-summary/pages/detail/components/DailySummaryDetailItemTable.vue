<template>
  <BaseTable
    :columns="columns"
    :items="items"
    hide-pagination>
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IDailySummaryDetailItemWithId } from '@/models/response/report/daily-summary/DailySummaryRes'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'

interface IProps {
  items?: IDailySummaryDetailItemWithId[]
}

withDefaults(defineProps<IProps>(), {
  items: (): IDailySummaryDetailItemWithId[] => []
})

const columns = ref<IColumn<IDailySummaryDetailItemWithId>[]>([
  {
    field: 'index',
    header: 'ลำดับ',
    align: 'center',
    style: { width: '70px', minWidth: '70px' }
  },
  {
    field: 'code',
    header: 'รหัสการชำระ',
    style: { width: '140px', minWidth: '140px' }
  },
  {
    field: 'category',
    header: 'หมวดหมู่'
  },
  {
    field: 'type',
    header: 'ประเภท',
    style: { width: '120px', minWidth: '120px' },
    value: (e: IDailySummaryDetailItemWithId): string => e.type === 'RECEIVE' ? 'รับ' : 'จ่าย'
  },
  {
    field: 'amount',
    header: 'มูลค่า',
    align: 'right',
    style: { width: '160px', minWidth: '160px' },
    value: (e: IDailySummaryDetailItemWithId): string => formatter.numberFormatNoDecimal(e.amount)
  }
])
</script>

<style scoped></style>
