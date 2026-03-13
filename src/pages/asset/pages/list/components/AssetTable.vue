<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    :table-style="tableStyle"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.assetNo`]="{ item }">
      <span class="font-semibold text-red-500">
        {{ item.assetNo }}
      </span>
    </template>
    <template #[`item.status`]="{ item }">
      <BaseChip
        :append-icon="statusIcon(item.status)"
        :label="statusLabel(item.status)"
        :text-class="statusTextClass(item.status)"
        :wrapper-class="statusWrapperClass(item.status)" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { IAssetList } from '@/models/response/asset/AssetRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import BaseChip from '@/components/chip/BaseChip.vue'
import type { IPagination } from '@/composables/usePagination'
import { formatter } from '@/utils/Formatter'

interface IProps {
  items: IAssetList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const tableStyle = 'min-width: 960px;'

const columns = ref<IColumn<IAssetList>[]>([
  { field: 'assetNo', header: 'เลขที่หลักทรัพย์', sortable: true, align: 'left', style: { minWidth: '140px' } },
  { field: 'customerName', header: 'ชื่อลูกค้า', sortable: false, align: 'left', style: { minWidth: '220px' } },
  { field: 'category', header: 'หมวดหมู่', sortable: false, align: 'left', style: { minWidth: '200px' } },
  {
    field: 'value',
    header: 'มูลค่า (บาท)',
    sortable: true,
    align: 'left',
    style: { minWidth: '150px' },
    value: (e: IAssetList): string => formatter.numberFormat(e.value)
  },
  {
    field: 'status',
    header: 'สถานะ',
    sortable: true,
    align: 'right',
    style: { minWidth: '110px' },
    headerClass: 'pr-6',
    bodyClass: 'pr-6'
  }
])

const statusConfig = computed<Record<string, { label: string, icon: string, wrapper: string, text: string }>>(():
Record<string, { label: string, icon: string, wrapper: string, text: string }> => ({
  WAITING: {
    label: 'รอขาย',
    icon: 'solar:clock-circle-linear',
    wrapper: 'border-[#FFF6DB] bg-[#FFF6DB] text-[#FFC000]',
    text: 'text-[#FFC000]'
  },
  IN_USE: {
    label: 'ใช้งาน',
    icon: 'solar:check-circle-linear',
    wrapper: 'border-[#CFFFE3] bg-[#CFFFE3] text-[#219653]',
    text: 'text-[#219653]'
  },
  SOLD: {
    label: 'ขายแล้ว',
    icon: 'mdi:tag-outline',
    wrapper: 'border-[#BDBDBD] bg-[#BDBDBD] text-[#333333]',
    text: 'text-[#333333]'
  }
})
)

function statusLabel (status: string): string {
  return statusConfig.value[status]?.label || '-'
}

function statusIcon (status: string): string {
  return statusConfig.value[status]?.icon || 'solar:question-circle-bold'
}

function statusWrapperClass (status: string): string {
  return statusConfig.value[status]?.wrapper || 'border-surface-200 bg-surface-50'
}

function statusTextClass (status: string): string {
  return statusConfig.value[status]?.text || 'text-surface-600'
}
</script>

<style scoped></style>
