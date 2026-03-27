<template>
  <div>
    <BaseActionMenu :items="items" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'

interface IProps {}

interface IEmits {
  edit: []
  delete: []
  resetPassword: []
}

defineProps<IProps>()
const emits = defineEmits<IEmits>()

const items = ref<IMenuItemAction[]>([
  { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: (): void => { emits('edit') } },
  { label: 'รีเซ็ตรหัสผ่าน', key: 'resetPassword', type: 'CONFIRM', action: (): void => { emits('resetPassword') } },
  { label: 'ลบ', key: 'delete', action: (): void => { emits('delete') }, type: 'DELETE' }
])


</script>

<style scoped></style>
