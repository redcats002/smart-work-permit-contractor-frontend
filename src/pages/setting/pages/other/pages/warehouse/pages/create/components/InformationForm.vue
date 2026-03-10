<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Switch
        v-model="isActive"
        class="col-span-3"
        false-label="ปิดใช้งาน"
        true-label="ใช้งาน" />
      <LabelField
        v-model="model.name"
        :form="form"
        label="ชื่อคลัง"
        name="name"
        hide-error
        required />
      <LabelField
        v-model="model.prefix"
        :form="form"
        label="ตัวย่อคลัง"
        name="prefix"
        hide-error
        required />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IFormState } from '@/models/Form.model'
import { WarehouseStatusEnum } from '@/enums/modules/warehouse/WarehouseStatus.enum'
import LabelField from '@/components/input/LabelField.vue'
import Switch from '@/components/input/Switch.vue'
import { useFormInitialValues, type WarehouseFormValues } from '../schema/warehouse.schema'

interface IProps {
  form?: IFormState
}

defineProps<IProps>()

const model = defineModel<WarehouseFormValues>({
  default: useFormInitialValues()
})

const isActive = computed({
  get (): boolean {
    return model.value?.status === WarehouseStatusEnum.ACTIVE ? true : false
  },
  set (value: boolean): void {
    model.value.status = value ? WarehouseStatusEnum.ACTIVE : WarehouseStatusEnum.INACTIVE
  }
})
</script>

<style scoped>

</style>
