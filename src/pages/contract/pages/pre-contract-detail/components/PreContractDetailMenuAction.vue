<template>
  <div>
    <BaseActionMenu :items="items" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'

interface IProps {
  status?: TPreContractStatus | null
}
interface IEmits {
  edit: []
  cancel: []
}

const props = withDefaults(defineProps<IProps>(), {
  status: undefined
})
const emits = defineEmits<IEmits>()

const items = computed((): IMenuItemAction[] => [
  // {
  //   key: 'edit',
  //   type: 'TEXT',
  //   label: 'แก้ไข',
  //   action: (): void => emits('edit')
  // },
  {
    key: 'power-of-attorney',
    type: 'TEXT',
    label: 'ออกเอกสาร หนังสือมอบอำนาจ',
    disabled: props?.status === 'CANCELLED'
  },
  {
    key: 'agenda',
    type: 'TEXT',
    label: 'ออกเอกสาร หนังสือวาระ',
    disabled: props?.status === 'CANCELLED'
  },
  {
    key: 'delete',
    type: 'DELETE',
    label: 'ยกเลิก',
    action: (): void => emits('cancel'),
    deleteProps: {
      title: 'ยกเลิกสัญญา',
      description1: 'คุณต้องการยกเลิกสัญญานี้หรือไม่',
      confirmLabel: 'ยืนยัน'
    },
    disabled: props?.status === 'CANCELLED'
  }
])


</script>

<style scoped></style>
