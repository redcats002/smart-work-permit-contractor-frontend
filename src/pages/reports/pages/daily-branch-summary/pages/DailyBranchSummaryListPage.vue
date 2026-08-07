<template>
  <section id="employee-list-page">
    <PageTitle />
    <BackButton
      class="mb-2" />
    <DailyBranchSummaryFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์"
        @click="onPrint()" />
    </DailyBranchSummaryFilter>
    <BasePage>
      <div>
        <DailyBranchSummaryTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
          :summary="summary"
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
import DailyBranchSummaryFilter from '../components/DailyBranchSummaryFilter.vue'
import DailyBranchSummaryTable from '../components/DailyBranchSummaryTable.vue'
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
  onSearch,
  onPrint
} = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
