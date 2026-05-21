<template>
  <section id="financial-summary-report-list-page">
    <PageTitle />
    <BackButton class="mb-2" />
    <FinancialSummaryReportFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <div class="flex items-center gap-2">
        <SelectFinancialSummaryType
          v-model="reportType"
          class="w-60" />
        <PrintButton
          icon="material-symbols:print-outline-rounded"
          label="พิมพ์" />
      </div>
    </FinancialSummaryReportFilter>
    <BasePage>
      <div>
        <FinancialSummaryReportTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
          :summary="summary"
          :type="reportType"
          @update="fetch()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { FinancialSummaryTypeEnum, type TFinancialSummaryType } from '@/enums/modules/report/financial-summary/FinancialSummaryType.enum'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import FinancialSummaryReportFilter from '../components/FinancialSummaryReportFilter.vue'
import FinancialSummaryReportTable from '../components/FinancialSummaryReportTable.vue'
import SelectFinancialSummaryType from '../components/SelectFinancialSummaryType.vue'
import useList from '../composables/useList'

const reportType = ref<TFinancialSummaryType>(FinancialSummaryTypeEnum.SUMMARY)

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
