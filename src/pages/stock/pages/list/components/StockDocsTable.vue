<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.docNo`]="{ item }">
      <LinkText :to="{ name: 'StockDetailPage', params: { id: 1 }}">
        {{ item?.docNo }}
      </LinkText>
    </template>
    <template #[`item.status`]="{ item }">
      <ChipStockDocsStatus :value="item.status" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import type { IStockDocsList } from '@/models/response/stock/StockDocsRes.model'
import ChipStockDocsStatus from './ChipStockDocsStatus.vue'

interface IProps {
  items: IStockDocsList[]
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()
const { formatDate } = useDayjs()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IStockDocsList>[]>([
  {
    field: 'docNo',
    header: 'เลขที่ใบย้ายเอกสาร',
    sortable: true,
    align: 'left'
  },
  {
    field: 'transferDate',
    header: 'วันที่',
    align: 'left',
    // สมมติว่า formatDate คือฟังก์ชันที่คุณใช้จัดการวันที่ พ.ศ.
    value: (e: IStockDocsList): string => formatDate(e.transferDate) || ''
  },
  {
    field: 'senderName',
    header: 'ย้ายโดย',
    align: 'left'
  },
  {
    field: 'originWarehouse',
    header: 'คลังต้นทาง',
    align: 'left'
  },
  {
    field: 'receiverName',
    header: 'รับโดย',
    align: 'left'
  },
  {
    field: 'destinationWarehouse',
    header: 'คลังปลายทาง',
    align: 'left'
  },
  {
    field: 'status',
    header: 'สถานะ',
    align: 'left'
  }
])
</script>

<style scoped></style>
