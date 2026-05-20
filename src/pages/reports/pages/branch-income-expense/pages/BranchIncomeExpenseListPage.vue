<template>
  <section id="branch-income-expense-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <BranchIncomeExpenseFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <Spacer />
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์" />
    </BranchIncomeExpenseFilter>
    <BasePage>
      <BranchIncomeExpenseTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :finance-category="filters.financeCategory"
        :items="items"
        :summary="summary"
        :transaction-type="filters.transactionType"
        @update="fetch()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import BranchIncomeExpenseFilter from '../components/BranchIncomeExpenseFilter.vue'
import BranchIncomeExpenseTable from '../components/BranchIncomeExpenseTable.vue'
import useList from '../composables/useList'

const {
  filters,
  items,
  summary,
  pagination,
  sortBy,
  sortOrder,
  search,
  fetch,
  onClearFilters,
  onSearch
} = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
