<template>
  <section id="percent-installment-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <ProfitBasedOnActualPaymentFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <Spacer />
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์"
        @click="onPrint()" />
    </ProfitBasedOnActualPaymentFilter>
    <BasePage>
      <ProfitBasedOnActualPaymentTable
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
import ProfitBasedOnActualPaymentFilter from '../components/ProfitBasedOnActualPaymentFilter.vue'
import ProfitBasedOnActualPaymentTable from '../components/ProfitBasedOnActualPaymentTable.vue'
import useList from '../composables/useList'

const {
  filters,
  items,
  pagination,
  sortBy,
  sortOrder,
  search,
  summary,
  fetch,
  onClearFilters,
  onSearch,
  onPrint
} = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
