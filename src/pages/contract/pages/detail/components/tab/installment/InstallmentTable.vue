<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.period`]="{ index }">
      {{ index + 1 }}
    </template>
    <template #[`item.status`]="{ item}">
      <ChipInstallmentStatus :value="item.status" />
    </template>
    <template #[`item.action`]="{ item }">
      <InstallmentMenuAction
        :payment-status="item.status"
        @create-invoice="emits('createInvoice', Number(item.id))"
        @edit="emits('update')" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IContractInstallmentList } from '@/models/response/contract/ContractRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipInstallmentStatus from './ChipInstallmentStatus.vue'
import InstallmentMenuAction from './InstallmentMenuAction.vue'

interface IProps {
  items: IContractInstallmentList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
  createInvoice: [id: number]
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IContractInstallmentList>[]>([
  { field: 'period', header: 'งวดที่' },
  { field: 'dueDate', header: 'กำหนดชำระ', value: (e: IContractInstallmentList): string => dayjs.formatDate(e?.dueDate) },
  // { field: 'created', header: 'วันที่ชำระ', value: (e: IContractInstallmentList): string => dayjs.formatDate(e?.receipts[0]?.paidAt || '') },
  { field: 'interest', header: 'ดอกเบี้ย', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e?.interest) },
  { field: 'principal', header: 'เงินต้นชำระ', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e?.principal) },
  { field: 'installment', header: 'ค่างวด', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e?.installment) },
  { field: 'remainingPrincipal', header: 'เงินต้นคงเหลือ', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e?.remainingPrincipal) },
  { field: 'penaltyFee', header: 'ค่าปรับ', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e?.penaltyFee) },
  { field: 'collectionFee', header: 'ค่าติดตาม', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e?.collectionFee) },
  { field: 'collectionFee', header: 'ค่าทนาย', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e?.collectionFee) },
  // { field: 'paymentAmount', header: 'ยอดชำระเงิน', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e?.receipts[0]?.amountPaid) },
  { field: 'status', header: 'สถานะ' },
  { field: 'action', header: 'จัดการ' },
  { field: 'action', header: 'รายละเอียด' }
])
</script>

<style scoped></style>
