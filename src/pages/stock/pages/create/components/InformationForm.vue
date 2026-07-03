<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
    <ConfirmModal
      v-model="visibleConfirm"
      description="เอกสารที่ต้องการย้ายจากคลังต้นทางจะถูกรีเซ็ตและเลือกใหม่ทั้งหมด"
      @confirm="onConfirm()" />
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      label="คลังต้นทาง"
      name="originalWarehouseId"
      required>
      <WarehouseSelection
        v-model="model.originalWarehouseId"
        :disabled-ids="[model.destinationWarehouseId]"
        :invalid="invalid"
        :query="{
          branchId: String(authStore.branch?.id) || '-1'
        }"
        name="originalWarehouseId"
        @update:model-value="onChangeOriginal($event)" />
    </LabelField>
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      label="คลังปลายทาง"
      name="destinationWarehouseId"
      required>
      <WarehouseSelection
        v-model="model.destinationWarehouseId"
        :disabled-ids="[model.originalWarehouseId]"
        :invalid="invalid"
        :query="{
          branchId: '-1'
        }"
        name="destinationWarehouseId"
        show-clear
        @update:model-value="onChangeDestination()" />
    </LabelField>
    <LabelField
      v-model="model.reason"
      :form="form"
      label="เหตุผล"
      name="reason"
      hide-error
      required />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import type { IFormState } from '@/models/Form.model'
import LabelField from '@/components/input/LabelField.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import WarehouseSelection from '@/components/selection/modules/api/warehouse/WarehouseSelection.vue'
import { type DocumentMovementFormValues, useFormInitialValues } from '../schema/document-movement'

interface IProps {
  form?: IFormState
}

defineProps<IProps>()

const authStore = useAuthStore()

const model = defineModel<DocumentMovementFormValues>({
  default: (): DocumentMovementFormValues => useFormInitialValues()
})
const visibleConfirm = ref<boolean>(false)

function onConfirm (): void {
  visibleConfirm.value = false
  model.value.assets = []
}

function onChangeOriginal (value?: number | null): void {
  if (!value) return
  if (model.value?.originalWarehouseId === model.value?.destinationWarehouseId) model.value.destinationWarehouseId = null
  if (value && model.value.assets?.length > 0) visibleConfirm.value = true
}

function onChangeDestination (): void {
  if (model.value?.originalWarehouseId === model.value?.destinationWarehouseId) {
    model.value.originalWarehouseId = null
  }
}

</script>

<style scoped>

</style>
