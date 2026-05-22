<template>
  <section id="document-movement-list-page">
    <PageTitle />
    <StockFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <CreateButton
        :to="{
          name: 'DocumentMovementCreatePage'
        }"
        label="สร้างย้ายเอกสารใหม่" />
    </StockFilter>
    <BasePage>
      <div>
        <StockDocsTable
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
import CreateButton from '@/components/button/CreateButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import StockDocsTable from '../components/MovementTable.vue'
import StockFilter from '../components/StockFilter.vue'
import useList from '../composables/movement/useList'

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

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
