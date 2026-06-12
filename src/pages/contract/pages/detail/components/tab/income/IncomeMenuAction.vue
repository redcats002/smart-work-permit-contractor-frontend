<template>
  <div>
    <BaseActionMenu :items="items" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'

interface IProps {}

interface IEmits {
  read: []
  edit: []
  delete: []
}

defineProps<IProps>()
const emits = defineEmits<IEmits>()

const items = computed((): IMenuItemAction[] => {
  const base: IMenuItemAction[] = [
    { label: 'รายละเอียด', key: 'read', type: 'TEXT', action: (): void => { emits('read') } },
    { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: (): void => { emits('edit') } },
    { label: 'ลบ', key: 'delete', type: 'DELETE', action: (): void => { emits('delete') } }
  ]
  return base
})


</script>

<style scoped></style>
