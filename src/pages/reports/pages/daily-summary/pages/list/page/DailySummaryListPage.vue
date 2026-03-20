<template>
  <section id="employee-list-page">
    <PageTitle />
    <BackButton />
    <DailySummaryFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <CreateButton
        label="สรุปประจำวัน" />
    </DailySummaryFilter>
    <BasePage>
      <div class="mt-5">
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
import PageTitle from '@/components/nav/PageTitle.vue'
import DailySummaryFilter from '../../list/components/DailySummaryFilter.vue'
import DailySummaryTable from '../../list/components/DailySummaryTable.vue'
import useList from '../composables/useList'
import BackButton from '@/components/button/BackButton.vue'
import CreateButton from '@/components/button/CreateButton.vue'

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
} = useList() // TODO: update when api ready

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
