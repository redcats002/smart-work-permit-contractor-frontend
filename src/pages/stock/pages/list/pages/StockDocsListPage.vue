<template>
  <section id="customer-list-page">
    <PageTitle />
    <StockFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <div>
        จำนวนสินทรัพย์ 35 รายการ
      </div>
    </StockFilter>

    <BasePage>
      <div class="mt-5">
        <StockDocsTable
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
import { onMounted, ref } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import StockFilter from '../components/StockFilter.vue'
import useList from '../composables/useList'
import type { IStockDocsList } from '@/models/response/stock/StockDocsRes.model'
import StockDocsTable from '../components/StockDocsTable.vue'

const {
  filters,
  // items,
  pagination,
  sortBy,
  sortOrder,
  search,
  // fetch,
  onClearFilters,
  onDelete
} = useList()

const mockStockDocsItems = ref<IStockDocsList[]>([
  {
    id: 1,
    docNo: 'EPS-00001',
    transferDate: '2024-03-12T00:00:00.000Z', // ในรูปคือ 12/3/67
    senderName: 'นาย จันทร์ พงษ์พัฒนโยธิน',
    originWarehouse: 'สำนักงานใหญ่',
    receiverName: 'นาย จันทร์ พงษ์พัฒนโยธิน',
    destinationWarehouse: 'สำนักงานใหญ่',
    status: 'PENDING', // รอรับ
    createdAt: '2024-03-12T00:00:00.000Z',
    updatedAt: '2024-03-12T00:00:00.000Z'
  },
  {
    id: 2,
    docNo: 'EPS-00003',
    transferDate: '2024-05-12T00:00:00.000Z', // ในรูปคือ 12/5/67
    senderName: 'นางสาว โชติกา ประชายศิริกุล',
    originWarehouse: 'ขอนแก่น',
    receiverName: 'นางสาว โชติกา ประชายศิริกุล',
    destinationWarehouse: 'ขอนแก่น',
    status: 'SUCCESS', // สำเร็จ
    createdAt: '2024-05-12T00:00:00.000Z',
    updatedAt: '2024-05-12T00:00:00.000Z'
  }
])

// For demonstration purposes, using mock data instead of fetching from API
const items = ref<IStockDocsList[]>([])
function fetch (): void {
  items.value = mockStockDocsItems.value
}

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
