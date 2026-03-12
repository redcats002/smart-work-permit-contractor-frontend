<template>
  <section id="employee-list-page">
    <PageTitle />
    <EmployeeFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <CreateButton
        :to="{
          name: 'EmployeeCreatePage'
        }"
        label="เพิ่มพนักงานใหม่" />
    </EmployeeFilter>
    <BasePage>
      <div class="mt-5">
        <EmployeeTable
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
import CreateButton from '@/components/button/CreateButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import EmployeeFilter from '../components/EmployeeFilter.vue'
import EmployeeTable from '../components/EmployeeTable.vue'
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

// Mock data
const mockItems = ref<any[]>([
  {
    id: 1,
    idNo: 'EM-26001',
    titleName: 'MR',
    firstName: 'เจษฎากร',
    lastName: 'เมืองนาม',
    status: 'ACTIVE',
    phoneNumber: '0823636036',
    email: 'chet@softnova.co',
    role: 'SUPER_ADMIN'
  },
  {
    id: 2,
    idNo: 'EM-26002',
    titleName: 'MS',
    firstName: 'สมหญิง',
    lastName: 'จริงใจ',
    status: 'INACTIVE',
    phoneNumber: '0987654321',
    email: 'somying@email.com',
    role: 'ACCOUNTING'
  },
  {
    id: 3,
    idNo: 'EM-26003',
    titleName: 'MR',
    firstName: 'มานะ',
    lastName: 'อดทน',
    status: 'ACTIVE',
    phoneNumber: '0812223334',
    email: 'mana@email.com',
    role: 'ADMIN'
  }
])

// For demonstration purposes, using mock data instead of fetching from API
const items = ref<any[]>([])
function fetch (): void {
  items.value = mockItems.value
}

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
