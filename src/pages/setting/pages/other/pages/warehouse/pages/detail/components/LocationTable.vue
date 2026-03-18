<template>
  <BaseTable
    :columns="columns"
    :items="items"
    :show-footer="false"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.status`]="{ index }">
      <Switch
        :model-value="items[index].status === 'ACTIVE'"
        :readonly="readonly"
        @update:model-value="onToggle(index)" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IWarehouseLocation } from '@/models/modules/warehouse/WarehouseLocation.model'
import type { IColumn } from '@/models/Table.model'
import Switch from '@/components/input/Switch.vue'
import BaseTable from '@/components/table/BaseTable.vue'

interface IProps {
  readonly?: boolean
}

withDefaults(defineProps<IProps>(), {
  readonly: false
})

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const items = defineModel<IWarehouseLocation[]>('items', {
  default: []
})
const columns = ref<IColumn<IWarehouseLocation>[]>([
  { field: 'status', header: 'สถานะ' },
  { field: 'name', header: 'จุดจัดเก็บ' }
])

function onToggle (index: number): void {
  const item = items.value[index]
  item.status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  emits('update')
}

</script>

<style scoped></style>
