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
          <label class="block text-sm font-medium text-surface-700 mb-1.5">สถานะ</label>
          <SelectInput
            v-model="filters.collateralStatus"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="ทั้งหมด"
            show-clear />
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
import type { IBaseOption } from '@/models/Global.model'
import type { IContractFilter } from '@/models/modules/contract/Filter.model'
import { EstateAssessmentStatusItems } from '@/enums/modules/contract/EstateAssessmentStatus.enum'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
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

const statusOptions: IBaseOption[] = [
  { label: 'ทั้งหมด', value: null },
  ...EstateAssessmentStatusItems
]

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
