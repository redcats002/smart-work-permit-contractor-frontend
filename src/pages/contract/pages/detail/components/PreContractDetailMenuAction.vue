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
  edit: []
  delete: []
}

defineProps<IProps>()
const emits = defineEmits<IEmits>()

const items = computed((): IMenuItemAction[] => [
  {
    key: 'edit',
    type: 'TEXT',
    label: 'แก้ไข',
    action: (): void => emits('edit')
  }
])


</script>

<style scoped></style>
