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
  delete: []
}

withDefaults(defineProps<IProps>(), {
  status: undefined
})
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
