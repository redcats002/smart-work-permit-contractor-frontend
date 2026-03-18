<template>
  <div class="grid gap-2.5">
    <Title
      title="ประวัติการติดต่อ">
      <ModalContractHistory />
    </Title>
    <ContactHistoryTable
      v-model:pagination="pagination"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      :items="items"
      @update="fetch()" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetContactHistoryList } from '@/models/request/contract/ContractReq.model'
import type { IContractContactHistoryList } from '@/models/response/contract/ContractRes.model'
import type { IContractProvider } from '@/resources/provider/contract/Contract.provider'
import ContractProvider from '@/resources/provider/contract/Contract.provider'
import usePagination from '@/composables/usePagination'
import Title from '../Title.vue'
import ContactHistoryTable from './ContactHistoryTable.vue'
import ModalContractHistory from './ModalContractHistory.vue'

const ContractService: IContractProvider = new ContractProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const filters = ref<IGetContactHistoryList>({})
const items = ref<IContractContactHistoryList[]>([])
const contractId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)

const paginateQuery = computed((): IGetContactHistoryList => {
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

async function useFetch (): Promise<void> {
  const mock = true // TODO: remove mock when api ready
  if (mock) {
    items.value = [
      {
        date: '2024-06-01',
        id: 1,
        detail: 'โทรติดต่อลูกค้า แจ้งยอดค้างชำระ',
        employee: {
          id: 1,
          titleName: 'MR',
          firstName: 'สมชาย',
          lastName: 'ใจดี',
          phoneNumber: '0812345678',
          status: 'ACTIVE',
          createdAt: '2024-05-01T10:00:00Z',
          updatedAt: '2024-06-01T09:00:00Z',
          createdBy: {
            id: 101,
            firstName: 'Admin',
            lastName: 'User'
          }
        },
        subject: 'แจ้งเตือนชำระหนี้',
        createdAt: '2024-06-01T10:30:00Z',
        createdBy: {
          id: 101,
          firstName: 'Admin',
          lastName: 'User'
        }
      },
      {
        id: 2,
        date: '2024-06-02',
        detail: 'ติดต่อลูกค้าไม่รับสาย',
        employee: {
          id: 2,
          titleName: 'MS',
          firstName: 'สุภาพร',
          lastName: 'ใจงาม',
          phoneNumber: '0898765432',
          status: 'ACTIVE',
          createdAt: '2024-05-02T11:00:00Z',
          updatedAt: '2024-06-02T09:00:00Z',
          createdBy: {
            id: 102,
            firstName: 'Staff',
            lastName: 'One'
          }
        },
        subject: 'ติดตามหนี้',
        createdAt: '2024-06-02T11:30:00Z',
        createdBy: {
          id: 102,
          firstName: 'Staff',
          lastName: 'One'
        }
      },
      {
        id: 3,
        date: '2024-06-03',
        detail: 'ลูกค้าติดต่อกลับ ขอผ่อนชำระ',
        employee: {
          id: 3,
          titleName: 'MRS',
          firstName: 'วราภรณ์',
          lastName: 'สุขใจ',
          phoneNumber: '0865432198',
          status: 'ACTIVE',
          createdAt: '2024-05-03T12:00:00Z',
          updatedAt: '2024-06-03T09:00:00Z',
          createdBy: {
            id: 103,
            firstName: 'Staff',
            lastName: 'Two'
          }
        },
        subject: 'ขอผ่อนชำระ',
        createdAt: '2024-06-03T12:30:00Z',
        createdBy: {
          id: 103,
          firstName: 'Staff',
          lastName: 'Two'
        }
      }
    ]
    return
  }
  const response = await ContractService.getContractHistoryList(contractId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}


function normalizeFilters (value: IGetContactHistoryList): Partial<IGetContactHistoryList> {
  return {
    ...value
  }
}

function fetch (): void {
  handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})

</script>

<style scoped>

</style>
