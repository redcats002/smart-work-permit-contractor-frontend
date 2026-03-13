<template>
  <div class="grid grid-cols-1 gap-4">
    <LabelField
      label="เอกสารหลักทรัพย์"
      name="assetDocument"
      placeholder="กรอกเอกสารหลักทรัพย์"
      hide-error
      required />
    <LabelField
      label="จุดจัดเก็บ"
      name="assetWarehouse"
      placeholder="กรอกจุดจัดเก็บ"
      hide-error
      required>
      <WarehouseSelection
        name="assetWarehouse"
        placeholder="กรอกจุดจัดเก็บ" />
    </LabelField>
  </div>
</template>

<script setup lang="ts">
import LabelField from '@/components/input/LabelField.vue'
import WarehouseSelection from '@/components/selection/modules/warehouse/WarehouseSelection.vue'

interface IProps {
  // form: IFormState
}

defineProps<IProps>()

</script>

<style scoped>

</style>
