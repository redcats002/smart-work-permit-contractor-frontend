<template>
  <section id="percent-installment-list-page">
    <PageTitle />
    <BackButton
      class="mb-2" />
    <BranchHeadSummaryFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์"
        @click="onPrint()" />
    </BranchHeadSummaryFilter>
    <BasePage>
      <div>
        <BranchHeadSummaryTable
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
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import BranchHeadSummaryFilter from '../components/BranchHeadSummaryFilter.vue'
import BranchHeadSummaryTable from '../components/BranchHeadSummaryTable.vue'
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
  onSearch,
  onPrint
} = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
