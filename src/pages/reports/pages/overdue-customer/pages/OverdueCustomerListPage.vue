<template>
  <section id="percent-installment-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <OverdueCustomerFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <Spacer />
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์" />
    </OverdueCustomerFilter>
    <BasePage>
      <OverdueCustomerTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
        :summary="summary"
        @delete="onDelete($event)"
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
import OverdueCustomerFilter from '../components/OverdueCustomerFilter.vue'
import OverdueCustomerTable from '../components/OverdueCustomerTable.vue'
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
  onDelete
} = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
