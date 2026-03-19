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
        <div class="grid grid-cols-1 gap-5">
          <div class="w-fit">
            <LabelField
              label="หมวดหมู่">
              <FinanceIncomeCategorySelection
                v-if="filter.transactionType==='INCOME'"
                v-model="filter.incomeCategoryId"
                show-clear />
              <FinanceExpenseCategorySelection
                v-if="filter.transactionType==='EXPENSE'"
                v-model="filter.expenseCategoryId"
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
    <TransactionTypeSelection
      v-model="filter.transactionType"
      class="grow" />
    <FinanceCategorySelection
      v-model="filter.financeCategory"
      class="grow" />
    <div>
      <slot />
    </div>
  </BaseTop>
</template>

<script setup lang="ts">
import type { IBranchIncomeExpenseFilter } from '@/models/modules/report/branch-income-expense/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import Spacer from '@/components/flex/Spacer.vue'
import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import FinanceExpenseCategorySelection from '@/components/selection/modules/finance-expense-category/FinanceExpenseCategorySelection.vue'
import FinanceIncomeCategorySelection from '@/components/selection/modules/finance-income-category/FinanceIncomeCategorySelection.vue'
import FinanceCategorySelection from '@/components/selection/modules/static/finance-category/FinanceCategorySelection.vue'
import TransactionTypeSelection from '@/components/selection/modules/static/transaction-type/TransactionTypeSelection.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>('search', { default: '' })
const filter = defineModel<IBranchIncomeExpenseFilter>('filters', { default: (): IBranchIncomeExpenseFilter => ({}) })

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
