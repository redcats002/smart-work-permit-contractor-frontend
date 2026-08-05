<template>
  <div>
    <div
      v-for="(_, i) in model.options"
      :key="`model-option-${i}`"
      class="flex items-end flex-wrap gap-5 mb-4 ">
      <Switch
        v-model="model.options[i].isRequirePrefix"
        :name="`options.${i}.isRequirePrefix`"
        class="mb-2 w-full md:w-fit"
        false-label="ไม่กำหนดตัวย่อ"
        true-label="กำหนดตัวย่อ" />
      <LabelField
        v-model="model.options[i].prefix"
        :disabled="!model.options[i].isRequirePrefix"
        :form="form"
        :name="`options.${i}.prefix`"
        class="grow"
        label="ตัวย่อจุดจัดเก็บ"
        hide-error
        required />
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        :name="`options.${i}.maxLimit`"
        class="grow"
        label="จำนวนสูงสุด"
        hide-error
        required>
        <InputNumber
          v-model="model.options[i].maxLimit"
          :invalid="invalid"
          :max="100"
          :name="`options.${i}.maxLimit`"
          class="h-9 w-full" />
      </LabelField>
      <Icon
        class="text-primary hover:bg-primary-100 transition-all cursor-pointer rounded-full p-1"
        height="32"
        icon="material-symbols:delete-outline"
        width="32"
        @click="onRemove(i)" />
    </div>
    <CreateButton
      label="เพิ่มจุดจัดเก็บ"
      @click="onAdd()" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useLoadingStore } from '@/stores/Loading'
import type { IFormState } from '@/models/Form.model'
import CreateButton from '@/components/button/CreateButton.vue'
import LabelField from '@/components/input/LabelField.vue'
import Switch from '@/components/input/Switch.vue'
import { Icon } from '@iconify/vue'
import { useGenerateLocationTable as buildLocationTable } from '../composables/useGenerateLocationTable'
import { useFormInitialValues, type WarehouseFormValues } from '../schema/warehouse.schema'

interface IProps {
  form?: IFormState
}
interface IEmits {
  mount: []
}

defineProps<IProps>()
const emits = defineEmits<IEmits>()

const loadingStore = useLoadingStore()

const model = defineModel<WarehouseFormValues>({
  default: (): WarehouseFormValues => useFormInitialValues()
})

function onAdd (): void {
  model.value.options.push({
    prefix: '',
    maxLimit: 0,
    isRequirePrefix: true
  })
}

function onRemove (index: number): void {
  model.value.options.splice(index, 1)
  emits('mount')
}

function generateLocationTable (): void {
  loadingStore.addLoading()
  model.value.locations = buildLocationTable(model.value.prefix, model.value.options, model.value.locations)
  loadingStore.removeLoading()
}

onMounted((): void => {
  generateLocationTable()
})

watch((): string => model.value.prefix, (): void => {
  generateLocationTable()
})
watch((): WarehouseFormValues['options'] => model.value.options, (): void => {
  generateLocationTable()
}, { deep: true })
</script>

<style scoped></style>
