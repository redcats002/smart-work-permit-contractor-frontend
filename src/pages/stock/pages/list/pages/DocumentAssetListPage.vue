<template>
  <section id="document-asset-list-page">
    <PageTitle />
    <DocumentAssetFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <div>
        จำนวนสินทรัพย์ {{ pagination.count }} รายการ
      </div>
    </DocumentAssetFilter>

    <BasePage>
      <div>
        <StockTable
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
import StockTable from '../components/asset/AssetTable.vue'
import DocumentAssetFilter from '../../create/components/DocumentAssetFilter.vue'
import useList from '../composables/asset/useList'

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
