<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    @update="emits('update')" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IDailySummaryListItem } from '@/models/response/report/daily-summary/DailySummaryRes'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IDailySummaryListItem[]
}

defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IDailySummaryListItem>[]>([
  {
    field: 'date',
    header: 'สรุปประจำวันที่',
    sortable: true,
    style: { width: '140px', minWidth: '140px' },
    value: (e: IDailySummaryListItem): string => e.date
  },
  {
    field: 'openBalance',
    header: 'ยอดคงเหลือยกมา',
    align: 'right',
    style: { width: '160px', minWidth: '160px' },
    value: (e: IDailySummaryListItem): string => formatter.numberFormat2Decimal(e.openBalance)
  },
  {
    field: 'closingBalance',
    header: 'ยอดคงเหลือยกไป',
    align: 'right',
    style: { width: '160px', minWidth: '160px' },
    value: (e: IDailySummaryListItem): string => formatter.numberFormat2Decimal(e.closingBalance)
  }
])
</script>

<style scoped></style>
