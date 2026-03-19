<template>
  <section id="percent-installment-list-page">
    <PageTitle />
    <BackButton
      class="mb-2" />
    <ContractSecurityDocumentReportFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์" />
    </ContractSecurityDocumentReportFilter>
    <BasePage>
      <div class="mt-5">
        <ContractSecurityDocumentReportTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import useList from '../composables/useList'
import ContractSecurityDocumentReportFilter from '../components/ContractSecurityDocumentReportFilter.vue'
import ContractSecurityDocumentReportTable from '../components/ContractSecurityDocumentReportTable.vue'
import BackButton from '@/components/button/BackButton.vue'

const {
  filters,
  items,
  pagination,
  sortBy,
  sortOrder,
  search,
  fetch,
  onClearFilters
} = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
