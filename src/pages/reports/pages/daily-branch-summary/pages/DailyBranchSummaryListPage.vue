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
          @update="fetch()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import DailyBranchSummaryFilter from '../components/DailyBranchSummaryFilter.vue'
import DailyBranchSummaryTable from '../components/DailyBranchSummaryTable.vue'
import useList from '../composables/useList'

const router = useRouter()

const {
  filters,
  items,
  pagination,
  sortBy,
  sortOrder,
  search,
  fetch,
  onClearFilters,
  onSearch
} = useList()

function onPrint (): void {
  router.push({
    name: 'DailyBranchSummaryPrintPage',
    query: {
      search: search.value || undefined,
      branchId: filters.value.branchId || undefined,
      startDate: filters.value.startDate || undefined,
      endDate: filters.value.endDate || undefined
    }
  })
}

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
