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
            label="รับ/จ่าย">
            <ExpensesTypeSelection
              v-model="filters.type"
              placeholder="ทั้งหมด"
              show-clear />
          </LabelField>
          <LabelField
            label="ประเภท">
            <FinanceExpenseCategorySelection
              v-model="filters.expenseCategoryId"
              placeholder="ทั้งหมด"
              show-clear
              @update:model-value="onUpdateCategory()" />
          </LabelField>
          <LabelField
            label="หมวดหมู่ค่าใช้จ่าย">
            <FinanceExpenseTypeSelection
              v-model="filters.expenseTypeId"
              :disabled="!filters.expenseCategoryId"
              :expense-category-id="filters.expenseCategoryId"
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
import type { IExpensesFilter } from '@/models/modules/expenses/Filter'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import Spacer from '@/components/flex/Spacer.vue'
import LabelField from '@/components/input/LabelField.vue'
// import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import FinanceExpenseCategorySelection from '@/components/selection/modules/api/finance-expense-category/FinanceExpenseCategorySelection.vue'
import FinanceExpenseTypeSelection from '@/components/selection/modules/api/finance-expense-type/FinanceExpenseTypeSelection.vue'
import ExpensesTypeSelection from '@/components/selection/modules/static/expense-type/ExpensesTypeSelection.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>('search', { default: '' })
const filters = defineModel<IExpensesFilter>('filters', { required: true })

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


function onUpdateCategory (): void {
  filters.value.expenseTypeId = undefined
}
</script>

<style scoped>

</style>
