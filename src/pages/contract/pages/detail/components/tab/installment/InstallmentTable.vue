<template>
  <BaseTable
    v-model:expanded-rows="expandedRows"
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="displayItems"
    disable-auto-left-padding
    disable-virtual-scroll
    @update="emits('update')">
    <template #[`item.period`]="{ index }">
      {{ index + 1 }}
    </template>
    <template #[`item.status`]="{ item }">
      <ChipInstallmentStatus :value="item.status" />
    </template>
    <template #[`item.action`]="{ item }">
      <InstallmentMenuAction
        :payment-status="item.status"
        @create-invoice="emits('createInvoice', Number(item.id))"
        @edit="emits('update')" />
    </template>
    <template #[`item.detail`]="{ item }">
      <div
        class="flex items-center justify-center cursor-pointer"
        @click="toggleExpand(item)">
        <Icon
          :class="expandedRows[String(item.id)] ? 'rotate-180' : ''"
          class="text-[#333333] transition-transform duration-200"
          height="20"
          icon="mdi:chevron-down"
          width="20" />
      </div>
    </template>
    <template #expansion="{ data }">
      <div class="bg-[#F2F2F2]">
        <!-- Sub-header -->
        <div
          :class="COL_SUB"
          class="grid h-12 px-4 border-b border-[#E0E0E0]">
          <div class="flex items-center text-sm font-bold text-[#333333]">
            วันที่ชำระ
          </div>
          <div class="flex items-center text-sm font-bold text-[#333333]">
            รายละเอียด
          </div>
          <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
            ที่ต้องชำระ
          </div>
          <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
            ชำระแล้ว
          </div>
          <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
            คงเหลือ
          </div>
        </div>

        <!-- Receipt groups -->
        <template
          v-for="(group, gi) in getReceiptGroups(data)"
          :key="gi">
          <template
            v-for="(row, fi) in group.rows"
            :key="fi">
            <div
              :class="COL_SUB"
              class="grid h-12 px-4 border-b border-[#E0E0E0]">
              <div class="flex items-center text-sm text-[#333333]">
                {{ fi === 0 ? dayjs.formatDate(group.paidAt) : '' }}
              </div>
              <div class="flex items-center text-sm text-[#333333]">
                {{ row.label }}
              </div>
              <div class="flex items-center justify-end text-sm text-[#333333]">
                {{ formatter.numberFormat2Decimal(row.due) }}
              </div>
              <div class="flex items-center justify-end text-sm text-[#333333]">
                {{ formatter.numberFormat2Decimal(row.paid) }}
              </div>
              <div class="flex items-center justify-end text-sm text-[#333333]">
                {{ formatter.numberFormat2Decimal(row.remaining) }}
              </div>
            </div>
          </template>
          <!-- Group total -->
          <div
            :class="COL_SUB"
            class="grid h-12 px-4 border-b-1 border-[#BD0102]">
            <div />
            <div class="flex items-center text-sm font-bold text-[#333333]">
              รวม
            </div>
            <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
              {{ formatter.numberFormat2Decimal(group.total.due) }}
            </div>
            <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
              {{ formatter.numberFormat2Decimal(group.total.paid) }}
            </div>
            <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
              {{ formatter.numberFormat2Decimal(group.total.remaining) }}
            </div>
          </div>
        </template>

        <!-- Grand total -->
        <div
          :class="COL_SUB"
          class="grid h-12 px-4 border-b-2 border-[#BD0102] bg-[#E8E8E8]">
          <div />
          <div class="flex items-center text-sm font-bold text-[#333333]">
            รวม
          </div>
          <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
            {{ formatter.numberFormat2Decimal(getGrandTotal(data).due) }}
          </div>
          <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
            {{ formatter.numberFormat2Decimal(getGrandTotal(data).paid) }}
          </div>
          <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
            {{ formatter.numberFormat2Decimal(getGrandTotal(data).remaining) }}
          </div>
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IContractInstallmentList, IContractInstallmentReceipt } from '@/models/response/contract/ContractRes.model'
import type { IColumn } from '@/models/Table.model'
import type { TPaymentStatus } from '@/enums/modules/contract/PaymentStatus.enum'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import { Icon } from '@iconify/vue'
import ChipInstallmentStatus from './ChipInstallmentStatus.vue'
import InstallmentMenuAction from './InstallmentMenuAction.vue'

const COL_SUB = 'grid-cols-[180px_1fr_130px_130px_130px]'

interface IFeeRow {
  label: string
  due: number
  paid: number
  remaining: number
}

interface IReceiptDisplayGroup {
  paidAt: string
  rows: IFeeRow[]
  total: { due: number, paid: number, remaining: number }
}

interface ITotals {
  due: number
  paid: number
  remaining: number
}

interface IProps {
  items: IContractInstallmentList[]
}

interface IEmits {
  update: []
  createInvoice: [id: number]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })
const expandedRows = ref<Record<string, IContractInstallmentList>>({})

const dayjs = useDayjs()

const columns = ref<IColumn<IContractInstallmentList>[]>([
  { field: 'period', header: 'งวดที่', align: 'center', style: 'width: 60px' },
  { field: 'dueDate', header: 'กำหนดชำระ', value: (e: IContractInstallmentList): string => dayjs.formatDate(e.dueDate) },
  { field: 'interest', header: 'ดอกเบี้ย', align: 'right', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.interest) },
  { field: 'principal', header: 'เงินต้นชำระ', align: 'right', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.principal) },
  { field: 'installment', header: 'ค่างวด', align: 'right', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.installment) },
  { field: 'remainingPrincipal', header: 'เงินต้นคงเหลือ', align: 'right', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.remainingPrincipal) },
  { field: 'penaltyFee', header: 'ค่าปรับ', align: 'right', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.penaltyFee) },
  { field: 'collectionFee', header: 'ค่าติดตาม', align: 'right', value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.collectionFee) },
  { field: 'legalFee' as keyof IContractInstallmentList, header: 'ค่าทนาย', align: 'right', value: (): string => '0.00' },
  { field: 'status', header: 'สถานะ', align: 'center' },
  { field: 'action' as keyof IContractInstallmentList, header: 'จัดการ', align: 'center' },
  { field: 'detail' as keyof IContractInstallmentList, header: 'รายละเอียด', align: 'center' }
])

function toggleExpand (item: IContractInstallmentList): void {
  const key = String(item.id)
  if (expandedRows.value[key]) {
    const updated = { ...expandedRows.value }
    delete updated[key]
    expandedRows.value = updated
  } else {
    expandedRows.value = { ...expandedRows.value, [key]: item }
  }
}

function getReceiptGroups (item: IContractInstallmentList): IReceiptDisplayGroup[] {
  const cumulative = { penaltyFee: 0, collectionFee: 0, interest: 0, principal: 0 }
  return item.receipts.map((receipt: IContractInstallmentReceipt): IReceiptDisplayGroup => {
    const penaltyDue = item.penaltyFee - cumulative.penaltyFee
    const collectionDue = item.collectionFee - cumulative.collectionFee
    const interestDue = item.interest - cumulative.interest
    const principalDue = item.principal - cumulative.principal
    const rows: IFeeRow[] = [
      { label: 'ค่าปรับ', due: penaltyDue, paid: receipt.penaltyFee, remaining: penaltyDue - receipt.penaltyFee },
      { label: 'ค่าติดตาม', due: collectionDue, paid: receipt.collectionFee, remaining: collectionDue - receipt.collectionFee },
      { label: 'ค่าทนาย', due: 0, paid: 0, remaining: 0 },
      { label: 'ดอกเบี้ย', due: interestDue, paid: receipt.interest, remaining: interestDue - receipt.interest },
      { label: 'เงินต้น', due: principalDue, paid: receipt.principal, remaining: principalDue - receipt.principal }
    ]
    cumulative.penaltyFee += receipt.penaltyFee
    cumulative.collectionFee += receipt.collectionFee
    cumulative.interest += receipt.interest
    cumulative.principal += receipt.principal
    const total = rows.reduce((acc: ITotals, r: IFeeRow): ITotals => ({
      due: acc.due + r.due,
      paid: acc.paid + r.paid,
      remaining: acc.remaining + r.remaining
    }), { due: 0, paid: 0, remaining: 0 })
    return { paidAt: receipt.paidAt, rows, total }
  })
}

function getGrandTotal (item: IContractInstallmentList): ITotals {
  const due = item.penaltyFee + item.collectionFee + item.interest + item.principal
  const paid = item.receipts.reduce((s: number, r: IContractInstallmentReceipt): number =>
    s + r.penaltyFee + r.collectionFee + r.interest + r.principal, 0)
  return { due, paid, remaining: due - paid }
}

// Mock data — swap to props.items when API is ready
const mockItems: IContractInstallmentList[] = [
  {
    id: 1,
    status: 'PAID' as TPaymentStatus,
    dueDate: '2024-03-12',
    interest: 1500,
    principal: 10000,
    installment: 11500,
    remainingPrincipal: 110000,
    penaltyFee: 120,
    outstandingPenaltyFee: 0,
    collectionFee: 500,
    outstandingCollectionFee: 0,
    period: 1,
    payment: 11500,
    balance: 110000,
    receipts: [
      { id: 1, paidAt: '2024-03-12', interest: 0, principal: 0, penaltyFee: 120, collectionFee: 380, discount: 0, amountPaid: 500 },
      { id: 2, paidAt: '2024-03-24', interest: 1500, principal: 10000, penaltyFee: 0, collectionFee: 120, discount: 0, amountPaid: 11620 }
    ]
  },
  {
    id: 2,
    status: 'PARTIAL' as TPaymentStatus,
    dueDate: '2024-04-12',
    interest: 1500,
    principal: 10000,
    installment: 11500,
    remainingPrincipal: 100000,
    penaltyFee: 120,
    outstandingPenaltyFee: 120,
    collectionFee: 500,
    outstandingCollectionFee: 380,
    period: 2,
    payment: 11500,
    balance: 100000,
    receipts: [
      { id: 3, paidAt: '2024-04-12', interest: 0, principal: 0, penaltyFee: 0, collectionFee: 120, discount: 0, amountPaid: 120 }
    ]
  },
  {
    id: 3,
    status: 'OVERDUE' as TPaymentStatus,
    dueDate: '2024-05-12',
    interest: 1500,
    principal: 10000,
    installment: 11500,
    remainingPrincipal: 90000,
    penaltyFee: 0,
    outstandingPenaltyFee: 0,
    collectionFee: 0,
    outstandingCollectionFee: 0,
    period: 3,
    payment: 11500,
    balance: 90000,
    receipts: []
  },
  {
    id: 4,
    status: 'NOT_DUE_YET' as TPaymentStatus,
    dueDate: '2024-06-12',
    interest: 1500,
    principal: 10000,
    installment: 11500,
    remainingPrincipal: 80000,
    penaltyFee: 0,
    outstandingPenaltyFee: 0,
    collectionFee: 0,
    outstandingCollectionFee: 0,
    period: 4,
    payment: 11500,
    balance: 80000,
    receipts: []
  },
  {
    id: 5,
    status: 'NOT_DUE_YET' as TPaymentStatus,
    dueDate: '2024-07-12',
    interest: 1500,
    principal: 10000,
    installment: 11500,
    remainingPrincipal: 70000,
    penaltyFee: 0,
    outstandingPenaltyFee: 0,
    collectionFee: 0,
    outstandingCollectionFee: 0,
    period: 5,
    payment: 11500,
    balance: 70000,
    receipts: []
  },
  {
    id: 6,
    status: 'NOT_DUE_YET' as TPaymentStatus,
    dueDate: '2024-08-12',
    interest: 1500,
    principal: 10000,
    installment: 11500,
    remainingPrincipal: 60000,
    penaltyFee: 0,
    outstandingPenaltyFee: 0,
    collectionFee: 0,
    outstandingCollectionFee: 0,
    period: 6,
    payment: 11500,
    balance: 60000,
    receipts: []
  },
  {
    id: 7,
    status: 'NOT_DUE_YET' as TPaymentStatus,
    dueDate: '2024-09-12',
    interest: 1500,
    principal: 10000,
    installment: 11500,
    remainingPrincipal: 50000,
    penaltyFee: 0,
    outstandingPenaltyFee: 0,
    collectionFee: 0,
    outstandingCollectionFee: 0,
    period: 7,
    payment: 11500,
    balance: 50000,
    receipts: []
  },
  {
    id: 8,
    status: 'NOT_DUE_YET' as TPaymentStatus,
    dueDate: '2024-10-12',
    interest: 1500,
    principal: 10000,
    installment: 11500,
    remainingPrincipal: 40000,
    penaltyFee: 0,
    outstandingPenaltyFee: 0,
    collectionFee: 0,
    outstandingCollectionFee: 0,
    period: 8,
    payment: 11500,
    balance: 40000,
    receipts: []
  },
  {
    id: 9,
    status: 'NOT_DUE_YET' as TPaymentStatus,
    dueDate: '2024-11-12',
    interest: 1500,
    principal: 10000,
    installment: 11500,
    remainingPrincipal: 30000,
    penaltyFee: 0,
    outstandingPenaltyFee: 0,
    collectionFee: 0,
    outstandingCollectionFee: 0,
    period: 9,
    payment: 11500,
    balance: 30000,
    receipts: []
  },
  {
    id: 10,
    status: 'NOT_DUE_YET' as TPaymentStatus,
    dueDate: '2024-12-12',
    interest: 1500,
    principal: 10000,
    installment: 11500,
    remainingPrincipal: 20000,
    penaltyFee: 0,
    outstandingPenaltyFee: 0,
    collectionFee: 0,
    outstandingCollectionFee: 0,
    period: 10,
    payment: 11500,
    balance: 20000,
    receipts: []
  }
]

const displayItems = props.items.length > 0 ? props.items : mockItems
</script>

<style scoped></style>
