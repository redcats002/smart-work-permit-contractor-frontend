<template>
  <section id="employee-list-page">
    <PageTitle />
    <DailyBranchSummaryFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์" />
    </DailyBranchSummaryFilter>
    <BasePage>
      <div class="mt-5">
        <DailyBranchSummaryTable
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
import PageTitle from '@/components/nav/PageTitle.vue'
import useList from '../composables/useList'
import PrintButton from '@/components/button/PrintButton.vue'
import DailyBranchSummaryTable from '../components/DailyBranchSummaryTable.vue'
import DailyBranchSummaryFilter from '../components/DailyBranchSummaryFilter.vue'

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
