<template>
  <section id="employee-list-page">
    <PageTitle />
    <BackButton />
    <DailyInstallmentFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์" />
    </DailyInstallmentFilter>
    <BasePage>
      <div>
        <DailyInstallmentTable
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
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import DailyInstallmentFilter from '../components/DailyInstallmentFilter.vue'
import DailyInstallmentTable from '../components/DailyInstallmentTable.vue'
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
} = useList() // TODO: update when api ready

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
