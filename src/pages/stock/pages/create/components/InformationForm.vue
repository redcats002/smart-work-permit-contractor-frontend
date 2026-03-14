<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
    <LabelField
      v-model="model.formWarehouse"
      :form="form"
      label="คลังต้นทาง"
      name="idCard"
      disabled
      hide-error />
    <LabelField
      v-model="model.toWarehouse"
      :form="form"
      label="คลังปลายทาง"
      name="idCard"
      hide-error
      required />
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
import type { IFormState } from '@/models/Form.model'
import LabelField from '@/components/input/LabelField.vue'
import { useFormInitialValues } from '../schema/stock.schema'
import type { ICreateStockDocsPayload } from '@/models/request/stock/StockReq.model'

interface IProps {
  form?: IFormState
}

defineProps<IProps>()

const model = defineModel<ICreateStockDocsPayload>({
  default: useFormInitialValues()
})

</script>

<style scoped>

</style>
