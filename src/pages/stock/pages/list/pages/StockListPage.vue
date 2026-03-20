<template>
  <section id="customer-list-page">
    <PageTitle />
    <StockFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <div>
        จำนวนสินทรัพย์ {{ pagination.count }} รายการ
      </div>
    </StockFilter>

    <BasePage>
      <div class="mt-5">
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
import StockFilter from '../components/StockFilter.vue'
import StockTable from '../components/StockTable.vue'
import useList from '../composables/useList'

const {
  filters,
  items,
  pagination,
  sortBy,
  sortOrder,
  search,
  fetch,
  onClearFilters
  // onDelete
} = useList()


// const items = ref<IStockList[]>([])
// function fetch (): void {
//   items.value = mockItems.value
// }

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
