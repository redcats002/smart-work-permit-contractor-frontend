<template>
  <BaseTop>
    <div>
      <SearchInput
        v-model="model"
        @search="onSearch()" />
    </div>
    <div>
      <FilterButton @click="open = true" />
    </div>
    <Spacer />
    <BranchIncomeExpenseCategorySelection
      v-model="filter.financeCategory"
      :report-type="reportType"
      class="grow" />
    <div>
      <slot />
    </div>
  </BaseTop>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TReportType } from '@/enums/modules/report/branch-income-expense/ReportType.enum'
import type { IBranchIncomeExpenseFilter } from '@/models/modules/report/branch-income-expense/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BranchIncomeExpenseCategorySelection from './BranchIncomeExpenseCategorySelection.vue'

interface IProps {
  reportType?: TReportType
}

defineProps<IProps>()

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>('search', { default: '' })
const filter = defineModel<IBranchIncomeExpenseFilter>('filters', { default: (): IBranchIncomeExpenseFilter => ({}) })

const open = ref<boolean>(false)

function onSearch (): void {
  emits('search')
}
</script>

<style scoped>

</style>
