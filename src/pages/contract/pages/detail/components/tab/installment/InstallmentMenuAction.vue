<template>
  <div>
    <BaseActionMenu
      :items="items" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingStore } from '@/stores/Loading'
import type { TInstallmentStatus } from '@/enums/modules/contract/InstallmentStatus.enum'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'

interface IProps {
  paymentStatus: TInstallmentStatus
  receiptId?: number
  collectionFee?: number
  legalFee?: number
}

interface IEmits {
  edit: []
  createInvoice: []
  viewReceipt: [receiptId: number]
  editPayment: []
  collectionFee: []
  legalFee: []
  payment: []
}

const props = withDefaults(defineProps<IProps>(), {
  collectionFee: 0,
  legalFee: 0,
  receiptId: undefined
})
const emits = defineEmits<IEmits>()

const loadingStore = useLoadingStore()

const collectionFeeLabel = computed((): string => props.collectionFee === 0 ? 'เพิ่มค่าติดตาม' : 'แก้ไขค่าติดตาม')
const legalFeeLabel = computed((): string => props.legalFee === 0 ? 'เพิ่มค่าทนาย' : 'แก้ไขค่าทนาย')

const items = computed((): IMenuItemAction[] => {
  const disabled = props.paymentStatus === 'NOT_DUE_YET'
  switch (props.paymentStatus) {
    case 'PAID':
      return [
        { label: 'ดูใบเสร็จรับเงิน', key: 'view-receipt', type: 'TEXT', action: (): void => { emits('viewReceipt', props.receiptId ?? 0) }, disabled },
        { label: 'แก้ไขการชำระ', key: 'edit-payment', type: 'TEXT', action: (): void => { emits('editPayment') }, disabled }
      ]
    case 'PARTIAL':
      return [
        { label: 'ดูใบเสร็จรับเงิน', key: 'view-receipt', type: 'TEXT', action: (): void => { emits('viewReceipt', props.receiptId ?? 0) }, disabled },
        { label: collectionFeeLabel.value, key: 'collection-fee', type: 'TEXT', action: (): void => { emits('collectionFee') }, disabled },
        { label: legalFeeLabel.value, key: 'legal-fee', type: 'TEXT', action: (): void => { emits('legalFee') }, disabled },
        { label: 'แก้ไขการชำระ', key: 'edit-payment', type: 'TEXT', action: (): void => { emits('editPayment') }, disabled }
      ]
    case 'OVERDUE':
      return [
        { label: 'ชำระเงิน', key: 'payment', type: 'TEXT', action: (): void => { emits('payment') }, disabled: loadingStore.isLoading || disabled },
        { label: 'ออกใบแจ้งหนี้', key: 'create-invoice', type: 'TEXT', action: (): void => { emits('createInvoice') }, disabled: loadingStore.isLoading || disabled },
        { label: collectionFeeLabel.value, key: 'collection-fee', type: 'TEXT', action: (): void => { emits('collectionFee') }, disabled },
        { label: legalFeeLabel.value, key: 'legal-fee', type: 'TEXT', action: (): void => { emits('legalFee') }, disabled }
      ]
    default:
      return [
        { label: 'ชำระเงิน', key: 'payment', type: 'TEXT', action: (): void => { emits('payment') }, disabled: loadingStore.isLoading || disabled },
        { label: 'ออกใบแจ้งหนี้', key: 'create-invoice', type: 'TEXT', action: (): void => { emits('createInvoice') }, disabled: loadingStore.isLoading || disabled }
      ]
  }
})
</script>

<style scoped></style>
