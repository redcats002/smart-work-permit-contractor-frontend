<template>
  <section id="contract-security-document-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
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
      <ContractSecurityDocumentReportTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
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
import PageTitle from '@/components/nav/PageTitle.vue'
import ContractSecurityDocumentReportFilter from '../components/ContractSecurityDocumentReportFilter.vue'
import ContractSecurityDocumentReportTable from '../components/ContractSecurityDocumentReportTable.vue'
import useList from '../composables/useList'

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
