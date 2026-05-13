<template>
  <BaseTable
    :columns="columns"
    :items="items"
    table-class="border-0"
    disable-auto-left-padding
    hide-pagination>
    <template #[`item.status`]="{ item }">
      <BaseChip
        :append-icon="statusIcon(item.status)"
        :label="item.status"
        :text-class="statusTextClass(item.status)"
        :wrapper-class="statusWrapperClass(item.status)" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IColumn } from '@/models/Table.model'
import BaseChip from '@/components/chip/BaseChip.vue'
import BaseTable from '@/components/table/BaseTable.vue'

export interface IAssetHistoryItem {
  id: number
  date: string
  origin: string
  destination: string
  sentBy: string
  receivedBy: string
  status: string
}

interface IProps {
  items: IAssetHistoryItem[]
}

defineProps<IProps>()

const columns = ref<IColumn<IAssetHistoryItem>[]>([
  { field: 'date', header: 'วันที่', align: 'left', style: { minWidth: '100px' } },
  { field: 'origin', header: 'ต้นทาง', align: 'left', style: { minWidth: '220px' } },
  { field: 'destination', header: 'ปลายทาง', align: 'left', style: { minWidth: '220px' } },
  { field: 'sentBy', header: 'ย้ายโดย', align: 'left', style: { minWidth: '200px' } },
  { field: 'receivedBy', header: 'รับโดย', align: 'left', style: { minWidth: '160px' } },
  { field: 'status', header: 'สถานะ', align: 'right', style: { minWidth: '110px' } }
])

function statusWrapperClass (status: string): string {
  if (status === 'รอรับ') return 'border-[#FFF6DB] bg-[#FFF6DB] text-[#FFC000]'
  return 'border-[#CFFFE3] bg-[#CFFFE3] text-[#219653]'
}

function statusTextClass (status: string): string {
  if (status === 'รอรับ') return 'text-[#FFC000]'
  return 'text-[#219653]'
}

function statusIcon (status: string): string {
  if (status === 'รอรับ') return 'solar:clock-circle-linear'
  return 'solar:check-circle-linear'
}
</script>
