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
      <div
        class="text-primary text-sm flex items-center font-bold">
        {{ item.idNo }}
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IBranchSummaryReportList } from '@/models/response/report/branch-summary/BranchSummaryRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IBranchSummaryReportList[]
}

defineProps<IProps>()
const dayjs = useDayjs()
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

const columns = ref<IColumn<IBranchSummaryReportList>[]>([
  { field: 'idNo', header: 'เลขที่สาขา', align: 'left', width: 150, sortable: true },
  { field: 'name', header: 'สาขา', align: 'left', width: 150 },
  { field: 'openAt', header: 'วันที่เปิดสาขา', align: 'left', width: 120, sortable: true, value: (e: IBranchSummaryReportList): string => dayjs.formatDate(e.openAt) },
  { field: 'duration', header: 'เปิดทำการมาแล้ว', align: 'left', width: 120, sortable: true, value: (e: IBranchSummaryReportList): string => dayjs.formatAge(e.openAt) }
])
</script>

<style scoped></style>
