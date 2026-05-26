<template>
  <BaseTable
    :columns="columns"
    :items="items"
    scroll-height="400px"
    disable-auto-left-padding
    hide-pagination
    @update="emits('update')">
    <template #[`item.status`]="{ index }">
      <Switch
        :model-value="items[index].status === 'ACTIVE'"
        :readonly="readonly"
        false-label="ปิด"
        label-class="font-medium"
        true-label="ใช้งาน"
        @update:model-value="onToggle(index)" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IColumn } from '@/models/Table.model'
import Switch from '@/components/input/Switch.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { WarehouseLocationFormValues } from '../../create/schema/warehouse.schema'

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

const items = defineModel<WarehouseLocationFormValues[]>('items', {
  default: []
})
const columns = ref<IColumn<WarehouseLocationFormValues>[]>([
  { field: 'status', header: 'สถานะ', style: { width: '120px', minWidth: '120px' } },
  { field: 'name', header: 'จุดจัดเก็บ', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' } }
])

function onToggle (index: number): void {
  const item = items.value[index]
  item.status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  emits('update')
}

</script>

<style scoped></style>
