<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.contractIdNo`]="{ item }">
      <LinkText :to="{ name: 'ReceiptDetailPage', params: { id: item.id } }">
        {{ item.contractIdNo }}
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
  { field: 'contractIdNo', header: 'เลขที่ใบเสร็จ', sortable: true, align: 'left' },
  { field: 'receiptDate', header: 'วันที่', align: 'left', value: (e: IReceiptList): string => formatDate(e.receiptDate ?? undefined) },
  {
    field: 'customer',
    header: 'ชื่อลูกค้า',
    align: 'left',
    value: (e: IReceiptList): string => formatter.fullName({
      titleName: e.customer?.titleName ?? undefined,
      firstName: e.customer?.firstName ?? undefined,
      lastName: e.customer?.lastName ?? undefined
    })
  },
  { field: 'totalValue', header: 'มูลค่า (บาท)', sortable: true, align: 'right', value: (e: IReceiptList): string => formatter.numberFormat(e.totalValue ?? 0) }
])
</script>
