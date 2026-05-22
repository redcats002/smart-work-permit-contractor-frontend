<template>
  <section id="employee-list-page">
    <PageTitle />
    <BackButton />
    <DailySummaryFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <CreateButton
        label="สรุปประจำวัน" />
    </DailySummaryFilter>
    <BasePage>
      <div>
        <DailySummaryTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
          @delete="onDelete($event)"
          @update="fetch()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import CreateButton from '@/components/button/CreateButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import DailySummaryFilter from '../../list/components/DailySummaryFilter.vue'
import DailySummaryTable from '../../list/components/DailySummaryTable.vue'
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
  onDelete,
  onSearch
} = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
