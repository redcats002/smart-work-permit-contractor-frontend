<template>
  <section id="customer-list-page">
    <PageTitle />
    <CustomerFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <CreateButton
        :to="{
          name: 'CustomerCreatePage'
        }"
        label="เพิ่มลูกค้าใหม่" />
    </CustomerFilter>
    <div class="mt-5">
      <CustomerTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
        @delete="onDelete($event)"
        @update="fetch()" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetCustomerList } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerList } from '@/models/response/customer/CustomerRes.model'
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import CreateButton from '@/components/button/CreateButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import CustomerFilter from '../components/CustomerFilter.vue'
import CustomerTable from '../components/CustomerTable.vue'
import usePagination from '@/composables/usePagination'

const CustomerService: ICustomerProvider = new CustomerProvider()

const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const filters = ref<IGetCustomerList>({})
const items = ref<ICustomerList[]>([])

const paginateQuery = computed((): IGetCustomerList => {
  const normalizedFilters = normalizeFilters(filters.value)
  return {
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    ...normalizedFilters
  }
})

async function useFetchPaginate (): Promise<void> {
  const mock = true
  if (mock) {
    items.value = [
      {
        id: 1,
        phoneNumber: '0888888888',
        phoneNumber2: '0888888889',
        customerGroup: { title: 'ลูกค้าใหม่', value: 0 },
        customerStatus: 'ACTIVE',
        firstName: 'จันทร์',
        lastName: 'พงษ์พัฒนโยธิน',
        idNo: 'CUS-00001',
        titleName: 'MR'
      },
      {
        id: 2,
        phoneNumber: '0888888888',
        customerGroup: { title: 'กลุ่มชำระล่าช้า', value: 0 },
        customerStatus: 'IN_ACTIVE',
        firstName: 'จันทร์',
        lastName: 'พงษ์พัฒนโยธิน',
        idNo: 'CUS-00002',
        titleName: 'MR'
      }
    ]
    return
  }
  const response = await CustomerService.getCustomerPaginate(paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}

async function useDelete (id: number): Promise<void> {
  await CustomerService.deleteCustomer(id)
  fetch()
  toast.success('ลบลูกค้าสําเร็จ')
}

function normalizeFilters (value: IGetCustomerList): Partial<IGetCustomerList> {
  return {
    ...value
  }
}

function fetch (): void {
  handleLoading(useFetchPaginate)
}

function onClearFilters (): void {}

function onDelete (id: number): void {
  handleLoading((): Promise<void> => useDelete(id))
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
