<template>
  <section id="customer-group-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ModalGroupAction
        v-model="form"
        @create="onCreate()"
        @delete="onDelete($event)"
        @update="onUpdate($event)" />
    </BaseTop>
    <div
      class="mx-auto max-w-6xl pt-4">
      <GroupTable
        v-model:form="form"
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
        @delete="onDelete($event)"
        @edit="onUpdate($event)"
        @update="fetch()" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionCustomerGroupPayload, IGetCustomerGroupList } from '@/models/request/customer-group/CustomerGroupReq.model'
import type { ICustomerGroupList } from '@/models/response/customer-group/CustomerGroupRes.model'
import type { ICustomerGroupProvider } from '@/resources/provider/customer-group/CustomerGroup.provider'
import CustomerGroupProvider from '@/resources/provider/customer-group/CustomerGroup.provider'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import GroupTable from '../components/CustomerGroupTable.vue'
import ModalGroupAction from '../components/ModalCustomerGroupAction.vue'
import usePagination from '@/composables/usePagination'
import { useFormInitialValues } from '../schema/customer-group.schema'

const CustomerGroupService: ICustomerGroupProvider = new CustomerGroupProvider()

const form = ref<IActionCustomerGroupPayload>(useFormInitialValues())
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const items = ref<ICustomerGroupList[]>([])

const paginateQuery = computed((): IGetCustomerGroupList => {
  return {
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value
  }
})

async function useFetch (): Promise<void> {
  const response = await CustomerGroupService.getCustomerGroupPaginate(paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery()
}

async function useCreate (): Promise<void> {
  await CustomerGroupService.createCustomerGroup(form.value)
  toast.success('ดำเนินการสำเร็จ')
}
async function useUpdate (id: number): Promise<void> {
  await CustomerGroupService.updateCustomerGroup(id, form.value)
  toast.success('ดำเนินการสำเร็จ')
}
async function useDelete (id: number): Promise<void> {
  await CustomerGroupService.deleteCustomerGroup(id)
  toast.success('ดำเนินการสำเร็จ')
}

function onCreate (): void {
  handleLoading(useCreate)
  fetch()
}
function onUpdate (id: number): void {
  handleLoading((): Promise<void> => useUpdate(id))
  fetch()
}
function onDelete (id: number): void {
  handleLoading((): Promise<void> => useDelete(id))
  fetch()
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
