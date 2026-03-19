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
import type { IAllStockList } from '@/models/response/report/all-stock/AllStockRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IAllStockList[]
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

const columns = ref<IColumn<IAllStockList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', width: 150 },
  { field: 'branchStock', header: 'สต็อกสำนักงานใหญ่', align: 'center', width: 120, value: (e: IAllStockList): string => formatter.numberFormat(e.branchStock) },
  { field: 'headOfficeStock', header: 'สต็อกสาขา', align: 'center', width: 120, value: (e: IAllStockList): string => formatter.numberFormat(e.headOfficeStock) },
  { field: 'executionStock', header: 'สต็อกบังคับคดี', align: 'center', width: 120, value: (e: IAllStockList): string => formatter.numberFormat(e.executionStock) },
  { field: 'totalStock', header: 'รวม', align: 'center', width: 120, value: (e: IAllStockList): string => formatter.numberFormat(e.totalStock) },
  { field: 'movingStock', header: 'กำลังโอนย้าย', align: 'center', width: 120, value: (e: IAllStockList): string => formatter.numberFormat(e.movingStock) },
  { field: 'totalAllStock', header: 'รวมทั้งหมด', align: 'center', width: 140, value: (e: IAllStockList): string => formatter.numberFormat(e.totalAllStock) }
])
</script>

<style scoped></style>
