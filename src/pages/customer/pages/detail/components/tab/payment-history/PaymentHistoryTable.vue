<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.receipt.id`]="{ item }">
      <LinkText
        :id="item.receipt?.id"
        :to="{ name: 'ReceiptDetailPage', params: { id: item.receipt?.id } }">
        {{ item.receipt?.idNo || '-' }}
      </LinkText>
    </template>
    <template #[`item.contract.id`]="{ item }">
      <LinkText
        :id="item.contract?.id"
        :to="{ name: 'ContractDetailPage', params: { id: item.contract?.id } }">
        {{ item.contract?.idNo || '-' }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { ICustomerPaymentHistoryList } from '@/models/response/customer/CustomerRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/contract/PaymentMethod.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: ICustomerPaymentHistoryList[]
}

defineProps<IProps>()

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

const columns = ref<IColumn<ICustomerPaymentHistoryList>[]>([
  { field: 'paidAt', header: 'วันที่ทำรายการ', align: 'left', style: { width: '140px', minWidth: '140px' }, value: (e: ICustomerPaymentHistoryList): string => dayjs.formatDate(e?.paidAt || '') },
  { field: 'receipt.id', header: 'เลขที่ใบเสร็จ', sortable: true, align: 'left', style: { width: '150px', minWidth: '150px' } },
  { field: 'contract.id', header: 'เลขที่สัญญา', align: 'left', style: { width: '150px', minWidth: '150px' } },
  { field: 'amount', header: 'ยอดชำระ (บาท)', align: 'right', style: { width: '150px', minWidth: '150px' }, value: (e: ICustomerPaymentHistoryList): string => formatter.numberFormat2Decimal(e?.amount || 0) },
  { field: 'paymentType', header: 'วิธีการชำระ', align: 'left', style: { width: '160px', minWidth: '160px' }, value: (e: ICustomerPaymentHistoryList): string => formatTitle(e?.paymentType) }
])
</script>

<style scoped></style>
