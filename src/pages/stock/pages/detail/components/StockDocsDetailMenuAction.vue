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
}

defineProps<IProps>()
const emits = defineEmits<IEmits>()

const items = ref<IMenuItemAction[]>([
  // { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: (): void => { emits('edit') } },
  { label: 'ยกเลิก', key: 'delete', action: (): void => { emits('delete') }, type: 'DELETE', deleteProps: { title: 'คุณต้องการยกเลิกใช่หรือไม่?', description1: 'การยกเลิกนี้ไม่สามารถย้อนกลับได้' } }
])


</script>

<style scoped></style>
