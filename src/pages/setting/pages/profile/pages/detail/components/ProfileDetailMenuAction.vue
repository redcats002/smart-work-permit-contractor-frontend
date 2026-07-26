<template>
  <div>
    <BaseActionMenu :items="items" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'

interface IEmits {
  edit: []
}

const emits = defineEmits<IEmits>()

const items = ref<IMenuItemAction[]>([
  { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: (): void => { emits('edit') } }
])
</script>

<style scoped></style>
