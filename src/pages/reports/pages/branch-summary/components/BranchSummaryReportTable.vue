<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

import type { IBranchSummaryReportList } from '@/models/response/report/branch-summary/BranchSummaryRes.model'
import { useDayjs } from '@/utils/Dayjs'

interface IProps {
  items: IBranchSummaryReportList[]
}

const props = defineProps<IProps>()
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
  { field: 'branchNo', header: 'เลขที่สาขา', align: 'left', width: 150 },
  { field: 'branchName', header: 'สาขา', align: 'left', width: 150 },
  { field: 'createdAt', header: 'วันที่เปิดสาขา', align: 'left', width: 120, value: (e: IBranchSummaryReportList): string => dayjs.formatDate(e.createdAt) },
  { field: 'openedTime', header: 'เปิดทำการมาแล้ว', align: 'left', width: 120, value: (e: IBranchSummaryReportList): string => dayjs.formatAge(e.openedTime) }
])
</script>

<style scoped></style>
