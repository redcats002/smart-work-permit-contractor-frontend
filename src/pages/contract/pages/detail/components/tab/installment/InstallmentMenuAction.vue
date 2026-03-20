<template>
  <div>
    <BaseActionMenu :items="items" />
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
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const loadingStore = useLoadingStore()

const items = computed((): IMenuItemAction[] => {
  const base: IMenuItemAction[] = [
    { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: (): void => { emits('edit') } },
    { label: 'ใบแจ้งหนี้', key: 'invoice', action: (): void => { }, type: 'TEXT' },
    { label: 'ใบเสร็จรับเงิน', key: 'receipt', action: (): void => { }, type: 'TEXT' }
  ]
  if (props.paymentStatus === 'PAID') return base
  return [
    { label: 'ดูรายละเอียด', key: 'detail', type: 'TEXT', action: (): void => { emits('edit') } },
    { label: 'ออกใบแจ้งหนี้', key: 'create-invoice', action: (): void => { emits('createInvoice') }, type: 'TEXT', disabled: loadingStore.isLoading },
    { label: 'ชำระเงิน', key: 'payment', action: (): void => { }, type: 'TEXT', disabled: loadingStore.isLoading }
  ]
})


</script>

<style scoped></style>
