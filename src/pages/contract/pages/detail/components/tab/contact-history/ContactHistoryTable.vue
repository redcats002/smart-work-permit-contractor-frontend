<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IContractContactHistoryList } from '@/models/response/contract-history/ContractHistoryRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IContractContactHistoryList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IContractContactHistoryList>[]>([
  { field: 'contactAt', header: 'วันที่', style: { width: '120px', minWidth: '120px' }, value: (e: IContractContactHistoryList): string => dayjs.formatDate(e?.contactAt || '') },
  { field: 'topic', header: 'เรื่อง', style: { width: '220px', minWidth: '220px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' } },
  { field: 'note', header: 'รายละเอียด', style: { width: '220px', minWidth: '220px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, bodyClass: 'max-w-[200px]' },
  { field: 'createdBy', header: 'โดยพนักงาน', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IContractContactHistoryList): string => formatter.fullName(e?.employee) }
])
</script>

<style scoped></style>
