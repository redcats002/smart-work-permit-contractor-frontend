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
          <LabelField label="ประเภทเงินกู้">
            <ContractLoanTypeSelection
              v-model="filters.loanTypeId"
              placeholder="ทั้งหมด"
              show-clear />
          </LabelField>
        </div>
        <div>
          <LabelField label="สถานะ">
            <ContractStatusSelection
              v-model="filters.status"
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
import type { IContractFilter } from '@/models/modules/contract/Filter.model'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import LabelField from '@/components/input/LabelField.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import ContractLoanTypeSelection from '@/components/selection/modules/contract-loan-type/ContractLoanTypeSelection.vue'
import ContractStatusSelection from '@/components/selection/modules/contract/ContractStatusSelection.vue'

interface IProps {}
withDefaults(defineProps<IProps>(), {})

interface IEmits {
  search: []
  clear: []
}
const emits = defineEmits<IEmits>()

const filters = defineModel<IContractFilter>('filters', {
  default: (): IContractFilter => ({})
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
