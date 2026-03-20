<template>
  <section id="employee-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <ComparativeFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์" />
    </ComparativeFilter>
    <BasePage>
      <ComparativeTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
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
import PageTitle from '@/components/nav/PageTitle.vue'
import ComparativeFilter from '../components/ComparativeFilter.vue'
import ComparativeTable from '../components/ComparativeTable.vue'
import useList from '../composables/useList'

const {
  filters,
  items,
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
