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
      <LinkText :to="{ name: 'BranchDetailPage', params: { id: item.id }}">
        {{ item?.idNo }}
      </LinkText>
    </template>
    <template #[`item.status`]="{ item }">
      <ChipBranchStatus :value="item.status" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IBranchList } from '@/models/response/branch/BranchRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipBranchStatus from './ChipBranchStatus.vue'

interface IProps {
  items: IBranchList[]
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

const columns = ref<IColumn<IBranchList>[]>([
  { field: 'idNo', header: 'เลขที่สาขา', sortable: true, align: 'left' },
  { field: 'name', header: 'ชื่อสาขา', align: 'left' },
  { field: 'status', header: 'สถานะ', sortable: true, align: 'right' }
])
</script>

<style scoped></style>
