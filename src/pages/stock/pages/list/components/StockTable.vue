<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.assetNo`]="{ item }">
      <LinkText :to="{ name: 'StockDetailPage', params: { id: 1 }}">
        {{ item?.assetNo }}
      </LinkText>
    </template>
    <template #[`item.contractNo`]="{ item }">
      <LinkText :to="{ name: 'StockDetailPage', params: { id: 1 }}">
        <!-- TODO: chang to real path -->
        {{ item?.contractNo }}
      </LinkText>
    </template>
    <template #[`item.status`]="{ item }">
      <ChipStockStatus :value="item.status" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IStockList } from '@/models/response/stock/StockRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipStockStatus from './ChipStockStatus.vue'

interface IProps {
  items: IStockList[]
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

const columns = ref<IColumn<IStockList>[]>([
  {
    field: 'assetNo',
    header: 'เลขที่หลักทรัพย์',
    sortable: true,
    align: 'left'
  },
  {
    field: 'contractNo',
    header: 'เลขที่สัญญา',
    sortable: true,
    align: 'left'
  },
  {
    field: 'receivedDate',
    header: 'วันที่รับเข้า',
    align: 'left',
    value: (e: IStockList): string => formatDate(e.receivedDate) || ''
  },
  {
    field: 'customerName',
    header: 'ชื่อลูกค้า',
    align: 'left',
    value: (e: IStockList): string => formatter.fullName(e)
  },
  {
    field: 'category',
    header: 'หมวดหมู่',
    align: 'left'
  },
  {
    field: 'warehouse',
    header: 'คลัง',
    align: 'left'
  },
  {
    field: 'storageLocation',
    header: 'จุดจัดเก็บ',
    align: 'left'
  },
  {
    field: 'status',
    header: 'สถานะ',
    sortable: true,
    align: 'left'
  }
])
</script>

<style scoped></style>
