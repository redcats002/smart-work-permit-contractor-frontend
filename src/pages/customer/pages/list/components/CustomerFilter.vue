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
        <div class="flex flex-col gap-5">
          <LabelField
            label="ประเภทบุคคล">
            <PersonalTypeSelection
              v-model="filters.personalType"
              placeholder="ทั้งหมด"
              show-clear />
          </LabelField>
          <LabelField
            label="กลุ่มลูกค้า">
            <CustomerGroupSelection
              v-model="filters.customerGroupId"
              placeholder="ทั้งหมด"
              show-clear />
          </LabelField>
          <LabelField
            label="สถานะ">
            <CustomerStatusSelection
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
    <Spacer class="hidden md:flex" />
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
import Spacer from '@/components/flex/Spacer.vue'
import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import CustomerGroupSelection from '@/components/selection/modules/api/customer-group/CustomerGroupSelection.vue'
import CustomerStatusSelection from '@/components/selection/modules/static/customer-status/CustomerStatusSelection.vue'
import PersonalTypeSelection from '@/components/selection/modules/static/personal-type/PersonalTypeSelection.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>('search', { default: '' })
const filters = defineModel<ICustomerFilter>('filters', { default: (): ICustomerFilter => ({}) })

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
