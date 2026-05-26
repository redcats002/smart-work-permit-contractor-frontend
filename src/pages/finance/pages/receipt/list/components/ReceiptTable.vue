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
      <LinkText :to="{ name: 'ReceiptDetailPage', params: { id: item.id } }">
        {{ item.idNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IReceiptList } from '@/models/response/receipt/ReceiptRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IReceiptList[]
}
const props = defineProps<IProps>()

interface IEmits {
  update: []
}
const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const { formatDate } = useDayjs()

const columns = ref<IColumn<IReceiptList>[]>([
  { field: 'idNo', header: 'เลขที่ใบเสร็จ', sortable: true, align: 'left', style: { width: '130px', minWidth: '130px' } },
  { field: 'paidAt', header: 'วันที่', align: 'left', style: { width: '120px', minWidth: '120px' }, value: (e: IReceiptList): string => formatDate(e.paidAt ?? undefined) },
  {
    field: 'customer',
    header: 'ชื่อลูกค้า',
    align: 'left',
    style: { width: '180px', minWidth: '180px' },
    bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' },
    value: (e: IReceiptList): string => e.customer.fullName ?? ''
  },
  { field: 'totalAmount', header: 'มูลค่า (บาท)', sortable: true, align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IReceiptList): string => formatter.numberFormat(e.totalAmount ?? 0) }
])
</script>
