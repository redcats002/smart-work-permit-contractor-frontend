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
import { formatter } from '@/utils/Formatter'
import type { IRankLendingList } from '@/models/response/report/rank-lending/RankLendingRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IRankLendingList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IRankLendingList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', width: 150 },
  { field: 'branchIdNo', header: 'เลขที่สาขา', align: 'left', width: 120 },
  { field: 'totalReceived', header: 'ยอดรับ', align: 'right', width: 120, value: (e: IRankLendingList): string => formatter.numberFormat(e.totalReceived) },
  { field: 'rankedInTopTimes', header: 'ติด TOP ครั้งที่', align: 'center', width: 120, value: (e: IRankLendingList): string => formatter.numberFormat(e.rankedInTopTimes) }
])
</script>

<style scoped></style>
