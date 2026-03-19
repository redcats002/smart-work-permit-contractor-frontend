<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding>
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
    <template #[`item.percentageCollection`]="{ item }">
      <span
        :class="item.percentageCollection != null ? 'text-green-500' : 'text-red-400'">
        {{
          item.percentageCollection
            ? formatter.numberFormat(item.percentageCollection)
            : 'ไม่นับยอดเก็บ'
        }}
      </span>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import type { IBranchHeadSummaryList } from '@/models/response/report/branch-head-summary/BranchHeadSummaryRes.model'

interface IProps {
  items: IBranchHeadSummaryList[]
}

const props = defineProps<IProps>()


const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IBranchHeadSummaryList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', width: 150 },
  { field: 'costPerInstallment', header: 'ค่างวดต่องวด', align: 'left', width: 120, value: (e: IBranchHeadSummaryList): string => formatter.numberFormat(e.costPerInstallment) },
  { field: 'percentageCollection',
    header: 'การคิด%ยอดเก็บ',
    align: 'left',
    width: 120,
    value: (e: IBranchHeadSummaryList): string => e.percentageCollection ? formatter.numberFormat(e.percentageCollection) : 'ไม่นับยอดเก็บ'
  },
  { field: 'collectionAmount', header: 'ยอดเก็บ', align: 'left', width: 120, value: (e: IBranchHeadSummaryList): string => formatter.numberFormat(e.collectionAmount) },
  { field: 'releaseAmount', header: 'ยอดปล่อย', align: 'left', width: 120, value: (e: IBranchHeadSummaryList): string => formatter.numberFormat(e.releaseAmount) }
])
</script>

<style scoped></style>
