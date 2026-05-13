<template>
  <section id="asset-list-page">
    <PageTitle />
    <AssetFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()" />
    <BasePage>
      <AssetTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
        @update="fetch()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AssetFilter from '../components/AssetFilter.vue'
import AssetTable from '../components/AssetTable.vue'
import useList from '../composables/useList'

const { filters, items, pagination, sortBy, sortOrder, search, fetch, onClearFilters } = useList()

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
