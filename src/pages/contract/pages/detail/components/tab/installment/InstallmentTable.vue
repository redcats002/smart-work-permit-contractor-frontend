<template>
  <BaseTable
    v-model:expanded-rows="expandedRows"
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    disable-virtual-scroll
    @update="emits('update')">
    <template #[`item.period`]="{ item }">
      {{ item.order }}
    </template>
    <template #[`item.status`]="{ item }">
      <ChipInstallmentStatus :value="item.status" />
    </template>
    <template #[`item.action`]="{ item }">
      <InstallmentMenuAction
        :collection-fee="item.collectionFee"
        :legal-fee="item.legalFee"
        :payment-status="item.status"
        @collection-fee="openFeeModal('collection', item)"
        @create-invoice="emits('createInvoice', Number(item.id))"
        @edit="emits('update')"
        @edit-payment="emits('editPayment', Number(item.id))"
        @legal-fee="openFeeModal('legal', item)"
        @payment="emits('payment', Number(item.id))"
        @view-receipt="emits('viewReceipt', Number(item.receiptId))" />
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

        <!-- Receipt items -->
        <template
          v-for="(receiptItem, gi) in data.items"
          :key="gi">
          <template
            v-for="(detail, fi) in receiptItem.details"
            :key="fi">
            <div
              :class="COL_SUB"
              class="grid h-12 px-4 border-b border-[#E0E0E0]">
              <div class="flex items-center text-sm text-[#333333]">
                {{ fi === 0 ? dayjs.formatDate(receiptItem.paidAt) : '' }}
              </div>
              <div class="flex items-center text-sm text-[#333333]">
                {{ detail.name }}
              </div>
              <div class="flex items-center justify-end text-sm text-[#333333]">
                {{ formatter.numberFormat2Decimal(detail.amount) }}
              </div>
              <div class="flex items-center justify-end text-sm text-[#333333]">
                {{ formatter.numberFormat2Decimal(detail.paid) }}
              </div>
              <div class="flex items-center justify-end text-sm text-[#333333]">
                {{ formatter.numberFormat2Decimal(detail.outstanding) }}
              </div>
            </div>
          </template>
          <!-- Receipt total row -->
          <div
            :class="COL_SUB"
            class="grid h-12 px-4 border-b border-[#BD0102]">
            <div />
            <div class="flex items-center text-sm font-bold text-[#333333]">
              รวม
            </div>
            <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
              {{ formatter.numberFormat2Decimal(receiptItem.summary.amount) }}
            </div>
            <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
              {{ formatter.numberFormat2Decimal(receiptItem.summary.paid) }}
            </div>
            <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
              {{ formatter.numberFormat2Decimal(receiptItem.summary.outstanding) }}
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
            {{ formatter.numberFormat2Decimal(getGrandTotal(data).amount) }}
          </div>
          <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
            {{ formatter.numberFormat2Decimal(getGrandTotal(data).paid) }}
          </div>
          <div class="flex items-center justify-end text-sm font-bold text-[#333333]">
            {{ formatter.numberFormat2Decimal(getGrandTotal(data).outstanding) }}
          </div>
        </div>
      </div>
    </template>
  </BaseTable>

  <!-- Fee modals -->
  <InstallmentFeeModal
    v-model="collectionFeeModalVisible"
    :initial-amount="selectedItem?.collectionFee ?? 0"
    :label="'ค่าติดตาม'"
    :title="selectedItem?.collectionFee === 0 ? 'เพิ่มค่าติดตาม' : 'แก้ไขค่าติดตาม'"
    @confirm="onConfirmCollectionFee($event)" />

  <InstallmentFeeModal
    v-model="legalFeeModalVisible"
    :initial-amount="selectedItem?.legalFee ?? 0"
    :label="'ค่าทนาย'"
    :title="selectedItem?.legalFee === 0 ? 'เพิ่มค่าทนาย' : 'แก้ไขค่าทนาย'"
    @confirm="onConfirmLegalFee($event)" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IContractInstallmentItem, IContractInstallmentList } from '@/models/response/contract/ContractRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import { Icon } from '@iconify/vue'
import ChipInstallmentStatus from './ChipInstallmentStatus.vue'
import InstallmentFeeModal from './InstallmentFeeModal.vue'
import InstallmentMenuAction from './InstallmentMenuAction.vue'

const COL_SUB = 'grid-cols-[180px_1fr_130px_130px_130px]'

interface IGrandTotal {
  amount: number
  paid: number
  outstanding: number
}

interface IProps {
  items: IContractInstallmentList[]
}

interface IFeePayload {
  id: number
  amount: number
}

interface IEmits {
  update: []
  createInvoice: [id: number]
  payment: [id: number]
  viewReceipt: [id: number]
  editPayment: [id: number]
  updateCollectionFee: [payload: IFeePayload]
  updateLegalFee: [payload: IFeePayload]
}

defineProps<IProps>()
const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })
const expandedRows = ref<Record<string, IContractInstallmentList>>({})

const collectionFeeModalVisible = ref<boolean>(false)
const legalFeeModalVisible = ref<boolean>(false)
const selectedItem = ref<IContractInstallmentList | null>(null)

const dayjs = useDayjs()

const columns = ref<IColumn<IContractInstallmentList>[]>([
  { field: 'period', header: 'งวดที่', align: 'center', style: { width: '70px', minWidth: '70px' } },
  { field: 'dueDate', header: 'กำหนดชำระ', style: { width: '120px', minWidth: '120px' }, value: (e: IContractInstallmentList): string => dayjs.formatDate(e.dueDate) },
  { field: 'interest', header: 'ดอกเบี้ย', align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.interest) },
  { field: 'principal', header: 'เงินต้นชำระ', align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.principal) },
  { field: 'installment', header: 'ค่างวด', align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.installment) },
  { field: 'remainingPrincipal', header: 'เงินต้นคงเหลือ', align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.remainingPrincipal) },
  { field: 'penaltyFee', header: 'ค่าปรับ', align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.penaltyFee) },
  { field: 'collectionFee', header: 'ค่าติดตาม', align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.collectionFee) },
  { field: 'legalFee', header: 'ค่าทนาย', align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IContractInstallmentList): string => formatter.numberFormat2Decimal(e.legalFee) },
  { field: 'status', header: 'สถานะ', align: 'center', style: { width: '120px', minWidth: '120px' } },
  { field: 'action' as keyof IContractInstallmentList, header: 'จัดการ', align: 'center', style: { width: '80px', minWidth: '80px' } },
  { field: 'detail' as keyof IContractInstallmentList, header: 'รายละเอียด', align: 'center', style: { width: '220px', minWidth: '220px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' } }
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

function getGrandTotal (item: IContractInstallmentList): IGrandTotal {
  return item.items.reduce((acc: IGrandTotal, receiptItem: IContractInstallmentItem): IGrandTotal => ({
    amount: acc.amount + receiptItem.summary.amount,
    paid: acc.paid + receiptItem.summary.paid,
    outstanding: acc.outstanding + receiptItem.summary.outstanding
  }), { amount: 0, paid: 0, outstanding: 0 })
}

function openFeeModal (type: 'collection' | 'legal', item: IContractInstallmentList): void {
  selectedItem.value = item
  if (type === 'collection') {
    collectionFeeModalVisible.value = true
  } else {
    legalFeeModalVisible.value = true
  }
}

function onConfirmCollectionFee (amount: number): void {
  if (!selectedItem.value) return
  emits('updateCollectionFee', { id: Number(selectedItem.value.id), amount })
}

function onConfirmLegalFee (amount: number): void {
  if (!selectedItem.value) return
  emits('updateLegalFee', { id: Number(selectedItem.value.id), amount })
}
</script>

<style scoped></style>
