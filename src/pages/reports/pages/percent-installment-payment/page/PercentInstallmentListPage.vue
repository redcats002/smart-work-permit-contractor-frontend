<template>
  <section id="employee-list-page">
    <PageTitle />
    <PercentInstallmentFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์" />
    </PercentInstallmentFilter>
    <BasePage>
      <div class="mt-5">
        <PercentInstallmentTable
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
import PercentInstallmentFilter from '../components/PercentInstallmentFilter.vue'
import PercentInstallmentTable from '../components/PercentInstallmentTable.vue'
import useList from '../composables/useList'
import PrintButton from '@/components/button/PrintButton.vue'

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
