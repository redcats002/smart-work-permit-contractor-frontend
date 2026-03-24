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
      <LinkText :to="{ name: 'EmployeeDetailPage', params: { id: item.id }}">
        {{ item?.idNo }}
      </LinkText>
    </template>
    <template #[`item.status`]="{ item }">
      <div class="flex justify-end">
        <ChipEmployeeStatus :value="item.status" />
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IEmployeeList } from '@/models/response/employee/EmployeeRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipEmployeeStatus from './ChipEmployeeStatus.vue'

interface IProps {
  items: IEmployeeList[]
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

const columns = ref<IColumn<IEmployeeList>[]>([
  { field: 'idNo', header: 'เลขที่พนักงาน', sortable: true, align: 'left' },
  { field: 'firstName', header: 'ชื่อพนักงาน', align: 'left', value: (e: IEmployeeList): string => formatter.fullName(e) },
  { field: 'status', header: 'สถานะ', sortable: true, align: 'right' }
])
</script>

<style scoped></style>
