<template>
  <section id="contract-loan-type-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ModalContractLoanTypeAction
        v-model="form"
        @create="onCreate()"
        @delete="onDelete($event)"
        @update="onUpdate($event)" />
    </BaseTop>
    <div
      class="mx-auto max-w-6xl pt-4">
      <ContractLoanTypeTable
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
import type { IActionContractLoanTypePayload, IGetContractLoanTypeList } from '@/models/request/contract-loan-type/ContractLoanTypeReq.model'
import type { IContractLoanTypeList } from '@/models/response/contract-loan-type/ContractLoanTypeRes.model'
import ContractLoanTypeProvider, { type IContractLoanTypeProvider } from '@/resources/provider/contract-loan-type/ContractLoanType.provider'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ContractLoanTypeTable from '../components/ContractLoanTypeTable.vue'
import ModalContractLoanTypeAction from '../components/ModalContractLoanTypeAction.vue'
import usePagination from '@/composables/usePagination'
import { useFormInitialValues } from '../schema/contract-loan-type.schema'

const ContractLoanTypeService: IContractLoanTypeProvider = new ContractLoanTypeProvider()

const form = ref<IActionContractLoanTypePayload>(useFormInitialValues())
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const items = ref<IContractLoanTypeList[]>([])

const paginateQuery = computed((): IGetContractLoanTypeList => {
  return {
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value
  }
})

async function useFetch (): Promise<void> {
  const response = await ContractLoanTypeService.getContractLoanTypePaginate(paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery()
}

async function useCreate (): Promise<void> {
  await ContractLoanTypeService.createContractLoanType(form.value)
  toast.success('ดำเนินการสำเร็จ')
}
async function useUpdate (id: number): Promise<void> {
  await ContractLoanTypeService.updateContractLoanType(id, form.value)
  toast.success('ดำเนินการสำเร็จ')
}
async function useDelete (id: number): Promise<void> {
  await ContractLoanTypeService.deleteContractLoanType(id)
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
