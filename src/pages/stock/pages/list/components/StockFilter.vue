<template>
  <BaseTop class="flex flex-wrap">
    <div>
      <SearchInput
        v-model="model"
        @search="onSearch()" />
    </div>
    <div>
      <BaseModal
        class="md:w-100!"
        label="ตัวกรอง">
        <template #activator="{ open }">
          <FilterButton @click="open()" />
        </template>
        <div class="flex flex-col gap-5">
          <LabelField
            label="วันที่เริ่มต้น">
            <DatePickerInput
              v-model="filters.startDate"
              :show-clear="true"
              placeholder="ทั้งหมด" />
          </LabelField>
          <LabelField
            label="คลังต้นทาง">
            <WarehouseSelection
              v-model="filters.originalWarehouseId"
              show-clear />
          </LabelField>
          <LabelField
            label="คลังปลายทาง">
            <WarehouseSelection
              v-model="filters.destinationWarehouseId"
              show-clear />
          </LabelField>
          <LabelField
            label="สถานะ">
            <DocumentMovementStatusSelection
              v-model="filters.status"
              placeholder="ทั้งหมด"
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
import type { IDocumentMovementFilter } from '@/models/modules/document-storage/Filter'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import Spacer from '@/components/flex/Spacer.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
// import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import WarehouseSelection from '@/components/selection/modules/api/warehouse/WarehouseSelection.vue'
import DocumentMovementStatusSelection from '@/components/selection/modules/static/document-movement-status/DocumentMovementStatusSelection.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>('search', { default: '' })
defineModel<IDocumentMovementFilter>('filters', { required: true })

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

<style scoped>

</style>
