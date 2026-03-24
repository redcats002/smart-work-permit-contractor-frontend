<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.idNo`]="{ item }">
      <LinkText :to="{ name: 'WarehouseDetailPage', params: { id: item.id }}">
        {{ item?.idNo }}
      </LinkText>
    </template>
    <template #[`item.status`]="{ item }">
      <div class="flex justify-end">
        <ChipWarehouseStatus :value="item.status" />
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IWarehouseList } from '@/models/response/warehouse/WarehouseRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipWarehouseStatus from './ChipWarehouseStatus.vue'

interface IProps {
  items: IWarehouseList[]
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IWarehouseList>[]>([
  { field: 'idNo', header: 'เลขที่คลัง', sortable: true, align: 'left' },
  { field: 'name', header: 'ชื่อคลัง', align: 'left' },
  { field: 'status', header: 'สถานะ', sortable: true, align: 'right' }
])
</script>

<style scoped></style>
