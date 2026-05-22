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
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const items = computed((): IMenuItemAction[] => [
  { label: 'พิมพ์สัญญา', key: 'print', type: 'TEXT', action: (): void => { emits('print') } },
  { label: 'แก้ไขสัญญา', key: 'edit', type: 'TEXT', action: (): void => { emits('edit') }, disabled: props.status === 'CANCELLED' },
  { label: 'ยกเลิกสัญญา', key: 'delete', action: (): void => { emits('delete') }, type: 'DELETE', deleteProps: { title: 'คุณต้องการยกเลิกสัญญา ?', description1: 'คุณแน่ใจหรือไม่ว่าต้องการยกเลิกสัญญานี้', description2: 'หากยกเลิกแล้ว สัญญานี้จะถูกยกเลิกอย่างถาวรไม่สามารถย้อนกลับได้', confirmLabel: 'ใช่, ฉันต้องการยกเลิก' }, disabled: props.status === 'CANCELLED' }
])


</script>

<style scoped></style>
