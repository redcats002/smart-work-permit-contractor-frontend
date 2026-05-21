<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.idNo`]="{ item }">
      <LinkText :to="{ name: 'DocumentMovementDetailPage', params: { id: item.id }}">
        {{ item?.idNo }}
      </LinkText>
    </template>
    <template #[`item.status`]="{ item }">
      <ChipMovementStatus :value="item.status" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IDocumentMovementList } from '@/models/response/document-storage/DocumentStorageRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipMovementStatus from './ChipMovementStatus.vue'

interface IProps {
  items: IDocumentMovementList[]
}

defineProps<IProps>()

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

const columns = ref<IColumn<IDocumentMovementList>[]>([
  { field: 'idNo', header: 'เลขที่ใบย้ายเอกสาร', sortable: true },
  { field: 'createdAt', header: 'วันที่', value: (e: IDocumentMovementList): string => formatDate(e.createdAt) || '' },
  { field: 'createdByEmployee', header: 'ย้ายโดย', value: (e: IDocumentMovementList): string => formatter.fullName(e.createdByEmployee) || '' },
  { field: 'originWarehouse', header: 'คลังต้นทาง', value: (e: IDocumentMovementList): string => e.originWarehouse?.name || '' },
  { field: 'receivedByEmployee', header: 'รับโดย', value: (e: IDocumentMovementList): string => formatter.fullName(e.receivedByEmployee) || '' },
  { field: 'destinationWarehouse', header: 'คลังปลายทาง', value: (e: IDocumentMovementList): string => e.destinationWarehouse?.name || '' },
  { field: 'status', header: 'สถานะ' }
])
</script>

<style scoped></style>
