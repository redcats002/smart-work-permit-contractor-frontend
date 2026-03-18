<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.action`]="{ item }">
      <HowDidFindUsMenuAction
        v-if="item?.id"
        v-model="form"
        :item="item"
        @delete="emits('delete', $event)"
        @edit="emits('edit', $event)" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IActionHowDidFindUsPayload } from '@/models/request/how-did-find-us/HowDidFindUsReq.model'
import type { IHowDidFindUsList } from '@/models/response/how-did-find-us/HowDidFindUsRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import HowDidFindUsMenuAction from './HowDidFindUsMenuAction.vue'

interface IProps {
  items: IHowDidFindUsList[]
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: TBaseParamsId]
  edit: [id: TBaseParamsId]
  update: []
}

const emits = defineEmits<IEmits>()

const form = defineModel<IActionHowDidFindUsPayload>('form', { required: true })
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IHowDidFindUsList>[]>([
  { field: 'name', header: 'ช่องทาง', align: 'left', value: (e: IHowDidFindUsList): string => e?.name || '' },
  { field: 'action', header: 'จัดการ', align: 'right' }
])
</script>

<style scoped></style>
