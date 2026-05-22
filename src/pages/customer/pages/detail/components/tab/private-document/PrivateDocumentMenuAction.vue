<template>
  <div>
    <BaseActionMenu :items="items" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'

interface IEmits {
  read: []
  edit: []
  delete: []
}

const emits = defineEmits<IEmits>()

const items = computed((): IMenuItemAction[] => [
  { label: 'รายละเอียด', key: 'read', type: 'TEXT', action: (): void => { emits('read') } },
  { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: (): void => { emits('edit') } },
  { label: 'ลบ', key: 'delete', type: 'TEXT', action: (): void => { emits('delete') } }
])
</script>

<style scoped></style>
