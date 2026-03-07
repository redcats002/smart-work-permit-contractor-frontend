<template>
  <section id="occupation-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ModalOccupationAction
        v-model="form"
        @create="onCreate()"
        @delete="onDelete($event)"
        @update="onUpdate($event)" />
    </BaseTop>
    <BasePage>
      <OccupationTable
        v-model:form="form"
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
        @delete="onDelete($event)"
        @edit="onUpdate($event)"
        @update="fetch()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionCustomerOccupationPayload, IGetCustomerOccupationList } from '@/models/request/customer-occupation/CustomerOccupationReq.model'
import type { ICustomerOccupationList } from '@/models/response/customer-occupation/CustomerOccupationRes.model'
import type { ICustomerOccupationProvider } from '@/resources/provider/customer-occupation/CustomerOccupation.provider'
import CustomerOccupationProvider from '@/resources/provider/customer-occupation/CustomerOccupation.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ModalOccupationAction from '../components/ModalOccupationAction.vue'
import OccupationTable from '../components/OccupationTable.vue'
import usePagination from '@/composables/usePagination'
import { useFormInitialValues } from '../schema/customer-occupation.schema'

const CustomerOccupationService: ICustomerOccupationProvider = new CustomerOccupationProvider()

const form = ref<IActionCustomerOccupationPayload>(useFormInitialValues())
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const items = ref<ICustomerOccupationList[]>([])

const paginateQuery = computed((): IGetCustomerOccupationList => {
  return {
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value
  }
})

async function useFetch (): Promise<void> {
  const response = await CustomerOccupationService.getCustomerOccupationPaginate(paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery()
}

async function useCreate (): Promise<void> {
  await CustomerOccupationService.createCustomerOccupation(form.value)
  toast.success('ดำเนินการสำเร็จ')
  await useFetch()
}
async function useUpdate (id: number): Promise<void> {
  await CustomerOccupationService.updateCustomerOccupation(id, form.value)
  toast.success('ดำเนินการสำเร็จ')
  await useFetch()
}
async function useDelete (id: number): Promise<void> {
  await CustomerOccupationService.deleteCustomerOccupation(id)
  toast.success('ดำเนินการสำเร็จ')
  await useFetch()
}

function onCreate (): void {
  handleLoading(useCreate)
}
function onUpdate (id: number): void {
  handleLoading((): Promise<void> => useUpdate(id))
}
function onDelete (id: number): void {
  handleLoading((): Promise<void> => useDelete(id))
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
