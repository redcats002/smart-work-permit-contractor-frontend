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
      <LinkText :to="{ name: 'InvoiceDetailPage', params: { id: item.id } }">
        {{ item.idNo }}
      </LinkText>
    </template>
    <template #[`item.contractNo`]="{ item }">
      {{ item.contract?.idNo }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IInvoiceList } from '@/models/response/invoice/InvoiceRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IInvoiceList[]
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

const columns = ref<IColumn<IInvoiceList>[]>([
  { field: 'idNo', header: 'เลขที่ใบแจ้งหนี้', sortable: true, align: 'left', style: { width: '130px', minWidth: '130px' } },
  { field: 'contractNo', header: 'เลขที่สัญญา', sortable: true, align: 'left', style: { width: '130px', minWidth: '130px' } },
  { field: 'invoiceDate', header: 'วันที่', align: 'left', style: { width: '120px', minWidth: '120px' }, value: (e: IInvoiceList): string => formatDate(e.createdAt ?? undefined) },
  {
    field: 'customer',
    header: 'ชื่อลูกค้า',
    align: 'left',
    style: { width: '180px', minWidth: '180px' },
    bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' },
    value: (e: IInvoiceList): string => formatter.fullName({
      titleName: e.contract?.customer?.titleName ?? undefined,
      firstName: e.contract?.customer?.firstName ?? undefined,
      lastName: e.contract?.customer?.lastName ?? undefined
    })
  },
  { field: 'totalAmount', header: 'มูลค่า (บาท)', sortable: true, align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IInvoiceList): string => formatter.numberFormat(e.totalAmount ?? 0) }
])
</script>
