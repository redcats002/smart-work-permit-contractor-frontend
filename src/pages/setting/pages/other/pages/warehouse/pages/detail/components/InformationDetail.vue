<template>
  <BaseContainer>
    <template #topright>
      <WarehouseDetailMenuAction
        @delete="emits('delete')"
        @edit="emits('edit')" />
    </template>
    <DisplayList :items="items">
      <template #[`value.status`]="{ value}">
        <ChipWarehouseStatus :value="value" />
      </template>
    </DisplayList>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IWarehouseById } from '@/models/response/warehouse/WarehouseRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipWarehouseStatus from '../../list/components/ChipWarehouseStatus.vue'
import WarehouseDetailMenuAction from './WarehouseDetailMenuAction.vue'

interface IProps {
  data: IWarehouseById
}
interface IEmits {
  edit: []
  delete: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const items = computed((): IDisplayList[] => {
  return [
    { label: 'สถานะ', key: 'status', value: props.data.status, hideColon: true },
    { label: 'เลขที่คลัง', key: 'idNo', value: props.data?.idNo || props.data?.id },
    { label: 'ชื่อคลัง', key: 'name', value: props.data.name },
    { label: 'คำนำหน้า', key: 'prefix', value: props.data?.prefix }
  ]
})
</script>

<style scoped>

</style>
