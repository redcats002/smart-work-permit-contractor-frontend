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
        <StockTable
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
import type { IStockList } from '@/models/response/stock/StockRes.model'
import BasePage from '@/components/base/BasePage.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import StockFilter from '../components/StockFilter.vue'
import StockTable from '../components/StockTable.vue'
import useList from '../composables/useList'

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

const mockItems = ref<IStockList[]>([{
  id: '1',
  assetNo: 'AS-00001',
  contractNo: 'LC-00001',
  receivedDate: '2024-03-12T00:00:00.000Z',
  titleName: 'MR',
  firstName: 'จันทร์',
  lastName: 'พงษ์พัฒนโยธิน',
  category: 'อสังหาริมทรัพย์ - ที่ดิน',
  warehouse: 'สำนักงานใหญ่',
  storageLocation: 'BR001-31-13',
  status: 'ACTIVE',
  createdAt: '2024-03-12T00:00:00.000Z',
  updatedAt: '2024-03-12T00:00:00.000Z',
  type: ''
},
{
  id: '2',
  assetNo: 'AS-00002',
  contractNo: 'LC-00002',
  receivedDate: '2024-04-12T00:00:00.000Z',
  titleName: 'MS',
  firstName: 'พันธนา',
  lastName: 'จิรวราพงษ์',
  category: 'อสังหาริมทรัพย์ - บ้าน',
  warehouse: 'ขอนแก่น',
  storageLocation: 'KK0991-90-55',
  status: 'LEGAL_PROCEEDING', // บังคับคดี
  createdAt: '2024-04-12T00:00:00.000Z',
  updatedAt: '2024-04-12T00:00:00.000Z',
  type: ''
},
{
  id: '3',
  assetNo: 'AS-00003',
  contractNo: 'LC-00003',
  receivedDate: '2024-05-12T00:00:00.000Z', // 12/5/67
  titleName: 'MRS',
  firstName: 'โชติกา',
  lastName: 'ประชาศิริกุล',
  category: 'อสังหาริมทรัพย์ - ที่ดิน',
  warehouse: 'ขอนแก่น',
  storageLocation: 'PL006-88-21',
  status: 'RETURNED', // คืนลูกค้า
  createdAt: '2024-05-12T00:00:00.000Z',
  updatedAt: '2024-05-12T00:00:00.000Z',
  type: ''
},
{
  id: '4',
  assetNo: 'AS-00004',
  contractNo: 'LC-00004',
  receivedDate: '2024-06-12T00:00:00.000Z', // 12/6/67
  titleName: 'MR',
  firstName: 'ปิยะพร',
  lastName: 'ชูติ้ง',
  category: 'อสังหาริมทรัพย์ - ห้องชุด',
  warehouse: 'ขอนแก่น',
  storageLocation: 'XZ1234-75-89',
  status: 'RETURNED',
  createdAt: '2024-06-12T00:00:00.000Z',
  updatedAt: '2024-06-12T00:00:00.000Z',
  type: ''
},
{
  id: '5',
  assetNo: 'AS-00005',
  contractNo: 'LC-00005',
  receivedDate: '2024-07-12T00:00:00.000Z', // 12/7/67
  titleName: 'MR',
  firstName: 'ธรรมศักดิ์',
  lastName: 'วงศ์ภักดี',
  category: 'ยานพาหนะ',
  warehouse: 'สำนักงานใหญ่',
  storageLocation: 'TR009-12-34',
  status: 'ACTIVE',
  createdAt: '2024-07-12T00:00:00.000Z',
  updatedAt: '2024-07-12T00:00:00.000Z',
  type: ''
}])

// For demonstration purposes, using mock data instead of fetching from API
const items = ref<IStockList[]>([])
function fetch (): void {
  items.value = mockItems.value
}

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
