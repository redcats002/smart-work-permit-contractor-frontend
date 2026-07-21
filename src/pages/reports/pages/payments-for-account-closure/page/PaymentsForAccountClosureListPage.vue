<template>
  <section id="percent-installment-list-page">
    <PageTitle />
    <BackButton />
    <BasePage>
      <PaymentsForAccountClosureFilter
        v-model:filters="filters"
        v-model:search="search"
        @clear="onClearFilters()"
        @search="onSearch()">
        <PrintButton
          icon="material-symbols:print-outline-rounded"
          label="พิมพ์" />
      </PaymentsForAccountClosureFilter>
      <div>
        <PaymentsForAccountClosureTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
          @update="fetch()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import PaymentsForAccountClosureFilter from '../components/PaymentsForAccountClosureFilter.vue'
import PaymentsForAccountClosureTable from '../components/PaymentsForAccountClosureTable.vue'
import useDebtCollectionPaymentClosure from '../composables/useDebtCollectionPaymentClosure'

const {
  items,
  filters,
  pagination,
  sortBy,
  sortOrder,
  search,
  fetch,
  onClearFilters,
  onSearch
} = useDebtCollectionPaymentClosure()

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
