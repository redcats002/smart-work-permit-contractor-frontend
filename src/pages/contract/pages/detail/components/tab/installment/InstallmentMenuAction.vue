<template>
  <div>
    <BaseActionMenu
      v-if="props.paymentStatus !== 'NOT_DUE_YET'"
      :items="items" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingStore } from '@/stores/Loading'
import type { TPaymentStatus } from '@/enums/modules/contract/PaymentStatus.enum'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'

interface IProps {
  paymentStatus: TPaymentStatus
}

interface IEmits {
  edit: []
  createInvoice: []
  viewReceipt: []
  editPayment: []
  addCollectionFee: []
  addLegalFee: []
  payment: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const loadingStore = useLoadingStore()

const items = computed((): IMenuItemAction[] => {
  switch (props.paymentStatus) {
    case 'PAID':
      return [
        { label: 'ดูใบเสร็จรับเงิน', key: 'view-receipt', type: 'TEXT', action: (): void => { emits('viewReceipt') } },
        { label: 'แก้ไขการชำระ', key: 'edit-payment', type: 'TEXT', action: (): void => { emits('editPayment') } }
      ]
    case 'PARTIAL':
      return [
        { label: 'ดูใบเสร็จรับเงิน', key: 'view-receipt', type: 'TEXT', action: (): void => { emits('viewReceipt') } },
        { label: 'เพิ่มค่าติดตาม', key: 'add-collection-fee', type: 'TEXT', action: (): void => { emits('addCollectionFee') } },
        { label: 'เพิ่มค่าทนาย', key: 'add-legal-fee', type: 'TEXT', action: (): void => { emits('addLegalFee') } },
        { label: 'แก้ไขการชำระ', key: 'edit-payment', type: 'TEXT', action: (): void => { emits('editPayment') } }
      ]
    case 'OVERDUE':
      return [
        { label: 'ชำระเงิน', key: 'payment', type: 'TEXT', action: (): void => { emits('payment') }, disabled: loadingStore.isLoading },
        { label: 'ออกใบแจ้งหนี้', key: 'create-invoice', type: 'TEXT', action: (): void => { emits('createInvoice') }, disabled: loadingStore.isLoading },
        { label: 'เพิ่มค่าติดตาม', key: 'add-collection-fee', type: 'TEXT', action: (): void => { emits('addCollectionFee') } },
        { label: 'เพิ่มค่าทนาย', key: 'add-legal-fee', type: 'TEXT', action: (): void => { emits('addLegalFee') } }
      ]
    default:
      return [
        { label: 'ชำระเงิน', key: 'payment', type: 'TEXT', action: (): void => { emits('payment') }, disabled: loadingStore.isLoading },
        { label: 'ออกใบแจ้งหนี้', key: 'create-invoice', type: 'TEXT', action: (): void => { emits('createInvoice') }, disabled: loadingStore.isLoading }
      ]
  }
})
</script>

<style scoped></style>
