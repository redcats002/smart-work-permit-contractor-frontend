<template>
  <BaseTop>
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
        <div class="space-y-4">
          <div>
            <LabelField label="สถานะ">
              <SelectInput
                v-model="filters.status"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                placeholder="ทั้งหมด"
                show-clear />
            </LabelField>
          </div>
          <div>
            <LabelField label="หมวดหมู่สถานะ">
              <SelectInput
                v-model="filters.assetCategoryStatus"
                :options="assetCategoryOptions"
                option-label="label"
                option-value="value"
                placeholder="ทั้งหมด"
                show-clear />
            </LabelField>
          </div>
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
import type { ICustomerFilter } from '@/models/modules/customer/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import { WorkStatusItems } from '@/enums/modules/work/WorkStatus.enum'
import Spacer from '@/components/flex/Spacer.vue'
// import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import type { IWorkFilter } from '@/models/modules/work/Filter.model'
import type { IBaseOption } from '@/models/Global.model'
import { AssetCategoryStatusItems } from '@/enums/modules/work/AssetCategoryStatus.enum'
import LabelField from '@/components/input/LabelField.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>('search', { default: '' })
const filters = defineModel<IWorkFilter>('filters', {
  default: (): IWorkFilter => ({})
})
const statusOptions: IBaseOption[] = [
  { label: 'ทั้งหมด', value: null },
  ...WorkStatusItems
]
const assetCategoryOptions: IBaseOption[] = [
  { label: 'ทั้งหมด', value: null },
  ...AssetCategoryStatusItems
]
defineModel<ICustomerFilter>('filter', { default: (): ICustomerFilter => ({}) })

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
