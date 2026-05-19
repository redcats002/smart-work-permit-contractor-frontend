<template>
  <section id="success-debtor-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <OutstandingDebtorFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์" />
    </OutstandingDebtorFilter>
    <BasePage>
      <OutstandingDebtorTable
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
import PageTitle from '@/components/nav/PageTitle.vue'
import OutstandingDebtorFilter
  from '@/pages/reports/pages/outstanding-debtor/components/OutstandingDebtorFilter.vue'
import OutstandingDebtorTable
  from '@/pages/reports/pages/outstanding-debtor/components/OutstandingDebtorTable.vue'
import { useSuccessDebtorList } from '@/pages/reports/pages/outstanding-debtor/composables/useList'

const {
  filters,
  items,
  summary,
  pagination,
  sortBy,
  sortOrder,
  search,
  fetch,
  onClearFilters
} = useSuccessDebtorList()

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
