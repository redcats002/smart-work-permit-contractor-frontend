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
            label="วันที่เริ่มต้น"
            placeholder="ทั้งหมด">
            <DatePickerInput
              v-model="filters.startDate"
              placeholder="เลือกวันเริ่มต้น"
              show-clear />
          </LabelField>
          <LabelField
            label="วันที่สิ้นสุด"
            placeholder="ทั้งหมด">
            <DatePickerInput
              v-model="filters.endDate"
              placeholder="เลือกวันสิ้นสุด"
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
import type { IDailyBranchSummaryFilter } from '@/models/modules/report/daily-branch-summary/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import Spacer from '@/components/flex/Spacer.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import BranchSelection from '@/components/selection/modules/api/branch/BranchSelection.vue'

interface IEmits {
  search: []
  clear: []
}

const emits = defineEmits<IEmits>()

const search = defineModel<string>('search', { default: '' })
const filters = defineModel<IDailyBranchSummaryFilter>('filters', { default: (): IDailyBranchSummaryFilter => ({}) })

function onSearch (): void {
  emits('search')
}

function onModalSearch (close: () => void): void {
  emits('search')
  close()
}

function onClear (close: () => void): void {
  filters.value = {}
  emits('search')
  emits('clear')
  close()
}
</script>

<style scoped></style>
