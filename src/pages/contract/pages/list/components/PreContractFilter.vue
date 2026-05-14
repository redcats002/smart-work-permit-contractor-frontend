<template>
  <BaseModal
    class="md:w-100!"
    label="ตัวกรอง">
    <template #activator="{ open }">
      <FilterButton @click="open()" />
    </template>
    <template #default>
      <div class="space-y-4">
        <div>
          <LabelField
            label="สถานะ"
            name="status"
            tag="div">
            <SelectInput
              v-model="filters.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="ทั้งหมด"
              show-clear />
          </LabelField>
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <FormActionFilter
        @clear="onClear(close)"
        @search="onSearch(close)" />
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IBaseOption } from '@/models/Global.model'
import type { IContractFilter } from '@/models/modules/contract/Filter.model'
import { PreContractStatusEnum, PreContractStatusItems } from '@/enums/modules/contract/PreContractStatus.enum'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'

interface IEmits {
  search: []
  clear: []
}
const emits = defineEmits<IEmits>()

const filters = defineModel<IContractFilter>('filters', {
  default: (): IContractFilter => ({})
})

const statusOptions = computed((): IBaseOption[] => {
  return [
    { label: 'ทั้งหมด', value: null },
    ...PreContractStatusItems.filter((item: IBaseOption): boolean => item.value !== PreContractStatusEnum.DONE)
  ]
})

function onSearch (close: () => void): void {
  emits('search')
  close()
}

function onClear (close: () => void): void {
  filters.value = {}
  emits('clear')
  close()
}
</script>
