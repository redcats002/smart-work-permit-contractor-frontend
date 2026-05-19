<template>
  <BaseTop>
    <div>
      <SearchInput
        v-model="search"
        @search="onSearch()" />
    </div>
    <div>
      <BaseModal
        class="md:w-100!"
        label="ตัวกรอง">
        <template #activator="{ open }">
          <FilterButton @click="open()" />
        </template>
        <div class="grid grid-cols-1 gap-5">
          <LabelField
            label="สาขา"
            placeholder="ทั้งหมด">
            <BranchSelection
              v-model="filters.branchId"
              show-clear />
          </LabelField>
          <LabelField
            label="ประเภทดอกเบี้ย"
            placeholder="ทั้งหมด">
            <SelectInput
              v-model="filters.interestType"
              :options="interestTypeOptions"
              show-clear />
          </LabelField>
          <LabelField
            label="วันที่ทำสัญญา (เริ่ม)"
            placeholder="ทั้งหมด">
            <DatePickerInput
              v-model="filters.startDateOfCreatedAt"
              show-clear />
          </LabelField>
          <LabelField
            label="วันที่ทำสัญญา (สิ้นสุด)"
            placeholder="ทั้งหมด">
            <DatePickerInput
              v-model="filters.endDateOfCreatedAt"
              show-clear />
          </LabelField>
          <LabelField
            label="วันที่ครบสัญญา (เริ่ม)"
            placeholder="ทั้งหมด">
            <DatePickerInput
              v-model="filters.startDateOfFinalInstallmentDate"
              show-clear />
          </LabelField>
          <LabelField
            label="วันที่ครบสัญญา (สิ้นสุด)"
            placeholder="ทั้งหมด">
            <DatePickerInput
              v-model="filters.endDateOfFinalInstallmentDate"
              show-clear />
          </LabelField>
        </div>
        <template #footer="{ close }">
          <FormActionFilter
            @clear="onClear(close)"
            @search="onModalSearch(close)" />
        </template>
      </BaseModal>
    </div>
    <Spacer />
    <div>
      <slot />
    </div>
  </BaseTop>
</template>

<script setup lang="ts">
import { InterestTypeItems } from '@/enums/modules/contract/InterestType.enum'
import type { IOutstandingDebtorFilter } from '@/models/modules/report/outstanding-debtor/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import Spacer from '@/components/flex/Spacer.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import BranchSelection from '@/components/selection/modules/api/branch/BranchSelection.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const interestTypeOptions = InterestTypeItems

const search = defineModel<string>('search', { default: '' })
const filters = defineModel<IOutstandingDebtorFilter>('filters', {
  default: (): IOutstandingDebtorFilter => ({})
})

function onSearch (): void {
  emits('search')
}

function onModalSearch (close: () => void): void {
  emits('search')
  emits('modalSearch')
  close()
}

function onClear (close: () => void): void {
  emits('search')
  emits('clear')
  close()
}
</script>

<style scoped></style>
