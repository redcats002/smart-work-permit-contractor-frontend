<template>
  <BaseTop>
    <div>
      <SearchInput
        v-model="model"
        @search="onSearch()" />
    </div>
    <div v-if="!hideFilter">
      <BaseModal
        class="md:w-100!"
        label="ตัวกรอง">
        <template #activator="{ open }">
          <FilterButton @click="open()" />
        </template>
        <LabelField
          label="สถานะ">
          <CustomerStatusSelection
            v-model="filters.status"
            placeholder="ทั้งหมด"
            show-clear />
        </LabelField>
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
import type { IEmployeeFilter } from '@/models/modules/employee/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import Spacer from '@/components/flex/Spacer.vue'
import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import CustomerStatusSelection from '@/components/selection/modules/static/customer-status/CustomerStatusSelection.vue'

interface IProps {
  hideFilter?: boolean
}
interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

withDefaults(defineProps<IProps>(), {
  hideFilter: false
})

const emits = defineEmits<IEmits>()

const model = defineModel<string>('search', { default: '' })
const filters = defineModel<IEmployeeFilter>('filters', { default: (): IEmployeeFilter => ({}) })

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
