<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    @update="emits('update')" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import type { IDailySummaryList } from '@/models/response/report/daily-summary/DailySummaryRes'
import { useDayjs } from '@/utils/Dayjs'

interface IProps {
  items: any[]
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

const columns = ref<IColumn<IDailySummaryList>[]>([
  { field: 'date',
    header: 'สรุปประจำวันที่',
    sortable: true,
    align: 'left',
    value: (e: IDailySummaryList): string => formatDate(e?.date ?? undefined) },
  { field: 'principalAmount', header: 'ยอดคงเหลือยกมา', sortable: false, align: 'left', class: 'red--text font-weight-bold' },
  { field: 'currentBalance', header: 'ยอดคงเหลือยกไป', sortable: false, align: 'right', class: 'red--text font-weight-bold' }
])

</script>

<style scoped></style>
