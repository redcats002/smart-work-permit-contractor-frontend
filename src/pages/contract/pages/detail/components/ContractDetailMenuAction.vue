<template>
  <div>
    <BaseActionMenu :items="items" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'

interface IProps {
  status: TContractStatus
}

interface IEmits {
  print: []
  edit: []
  delete: []
  closeAccount: []
  finance: []
  createRefinance: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const isAbleToRefinance = computed((): boolean => {
  if (props.status === 'PENDING') return true
  return false
})
const isAbleToCreateNewContract = computed((): boolean => {
  if (props.status === 'PENDING_REFINANCE') return true
  return false
})
const isAbleToEdit = computed((): boolean => {
  if (props.status === 'CANCELLED' || props.status === 'CLOSE_CONTRACT' || props.status === 'PENDING_REFINANCE') return false
  return true
})
const isAbleToCancelled = computed((): boolean => {
  if (props.status === 'CANCELLED' || props.status === 'CLOSE_CONTRACT') return false
  return true
})

const items = computed((): IMenuItemAction[] => {
  const base: IMenuItemAction[] = [
    { label: 'พิมพ์สัญญา', key: 'print', type: 'TEXT', action: (): void => { emits('print') } },
    { label: 'ปิดบัญชี', key: 'closeAccount', type: 'TEXT', action: (): void => { emits('closeAccount') }, disabled: !isAbleToRefinance.value },
    { label: 'รีไฟแนนซ์', key: 'finance', type: 'TEXT', action: (): void => { emits('finance') }, disabled: !isAbleToRefinance.value },
    { label: 'แก้ไขสัญญา', key: 'edit', type: 'TEXT', action: (): void => { emits('edit') }, disabled: !isAbleToEdit.value },
    { label: 'ยกเลิกสัญญา', key: 'delete', action: (): void => { emits('delete') }, type: 'DELETE', deleteProps: { title: 'คุณต้องการยกเลิกสัญญา ?', description1: 'คุณแน่ใจหรือไม่ว่าต้องการยกเลิกสัญญานี้', description2: 'หากยกเลิกแล้ว สัญญานี้จะถูกยกเลิกอย่างถาวรไม่สามารถย้อนกลับได้', confirmLabel: 'ใช่, ฉันต้องการยกเลิก' }, disabled: !isAbleToCancelled.value }
  ]
  if (!isAbleToCreateNewContract.value) return base
  return [
    { label: 'พิมพ์สัญญา', key: 'print', type: 'TEXT', action: (): void => { emits('print') } },
    { label: 'สร้างสัญญาใหม่', key: 'createRefinance', action: (): void => { emits('createRefinance') }, type: 'CONFIRM' }
  ]
})


</script>

<style scoped></style>
