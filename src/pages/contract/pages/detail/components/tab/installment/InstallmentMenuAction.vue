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
  collectionFee?: number
  legalFee?: number
}

interface IEmits {
  edit: []
  createInvoice: []
  viewReceipt: []
  editPayment: []
  collectionFee: []
  legalFee: []
  payment: []
}

const props = withDefaults(defineProps<IProps>(), {
  collectionFee: 0,
  legalFee: 0
})
const emits = defineEmits<IEmits>()

const loadingStore = useLoadingStore()

const collectionFeeLabel = computed((): string => props.collectionFee === 0 ? 'เพิ่มค่าติดตาม' : 'แก้ไขค่าติดตาม')
const legalFeeLabel = computed((): string => props.legalFee === 0 ? 'เพิ่มค่าทนาย' : 'แก้ไขค่าทนาย')

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
        { label: collectionFeeLabel.value, key: 'collection-fee', type: 'TEXT', action: (): void => { emits('collectionFee') } },
        { label: legalFeeLabel.value, key: 'legal-fee', type: 'TEXT', action: (): void => { emits('legalFee') } },
        { label: 'แก้ไขการชำระ', key: 'edit-payment', type: 'TEXT', action: (): void => { emits('editPayment') } }
      ]
    case 'OVERDUE':
      return [
        { label: 'ชำระเงิน', key: 'payment', type: 'TEXT', action: (): void => { emits('payment') }, disabled: loadingStore.isLoading },
        { label: 'ออกใบแจ้งหนี้', key: 'create-invoice', type: 'TEXT', action: (): void => { emits('createInvoice') }, disabled: loadingStore.isLoading },
        { label: collectionFeeLabel.value, key: 'collection-fee', type: 'TEXT', action: (): void => { emits('collectionFee') } },
        { label: legalFeeLabel.value, key: 'legal-fee', type: 'TEXT', action: (): void => { emits('legalFee') } }
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
