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
  print: []
}

const props = withDefaults(defineProps<IProps>(), {
  status: undefined
})
const emits = defineEmits<IEmits>()


const items = computed((): IMenuItemAction[] => {
  const menuItems: IMenuItemAction[] = [
    // {
  //   key: 'edit',
  //   type: 'TEXT',
  //   label: 'แก้ไข',
  //   action: (): void => emits('edit')
  // },
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
  ]
  if (props.status === 'PENDING_REVIEW') menuItems.unshift({ label: 'พิมพ์สัญญา', key: 'print', type: 'TEXT', action: (): void => emits('print') })

  return menuItems
})


</script>

<style scoped></style>
