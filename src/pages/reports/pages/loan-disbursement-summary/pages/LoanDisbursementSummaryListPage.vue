<template>
  <section id="daily-loan-disbursement-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <LoanDisbursementSummaryFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <Spacer />
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์" />
    </LoanDisbursementSummaryFilter>
    <BasePage>
      <LoanDisbursementSummaryTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
        :summary="summary"
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
import LoanDisbursementSummaryFilter from '../components/LoanDisbursementSummaryFilter.vue'
import LoanDisbursementSummaryTable from '../components/LoanDisbursementSummaryTable.vue'
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
