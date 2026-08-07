<template>
  <section id="outstanding-debtor-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <OutstandingDebtorFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์"
        @click="onPrint()" />
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
import OutstandingDebtorFilter from '../components/OutstandingDebtorFilter.vue'
import OutstandingDebtorTable from '../components/OutstandingDebtorTable.vue'
import { useOutstandingDebtorList } from '../composables/useList'

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
  onSearch,
  onPrint
} = useOutstandingDebtorList()

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
