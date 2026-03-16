<template>
  <section id="contract-loan-purpose-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ModalContractLoanPurposeAction
        v-model="form"
        @create="onCreate()"
        @delete="onDelete($event)"
        @update="onUpdate($event)" />
    </BaseTop>
    <BasePage>
      <ContractLoanPurposeTable
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
import type { IActionContractLoanPurposePayload, IGetContractLoanPurposeList } from '@/models/request/contract-loan-purpose/ContractLoanPurposeReq.model'
import type { IContractLoanPurposeList } from '@/models/response/contract-loan-purpose/ContractLoanPurposeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import ContractLoanPurposeProvider, { type IContractLoanPurposeProvider } from '@/resources/provider/contract-loan-purpose/ContractLoanPurpose.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ContractLoanPurposeTable from '../components/ContractLoanPurposeTable.vue'
import ModalContractLoanPurposeAction from '../components/ModalContractLoanPurposeAction.vue'
import usePagination from '@/composables/usePagination'
import { useFormInitialValues } from '../schema/contract-loan-purpose.schema'

const ContractLoanPurposeService: IContractLoanPurposeProvider = new ContractLoanPurposeProvider()

const form = ref<IActionContractLoanPurposePayload>(useFormInitialValues())
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const items = ref<IContractLoanPurposeList[]>([])

const paginateQuery = computed((): IGetContractLoanPurposeList => {
  return {
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value
  }
})

async function useFetch (): Promise<void> {
  const response = await ContractLoanPurposeService.getContractLoanPurposePaginate(paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery()
}

async function useCreate (): Promise<void> {
  await ContractLoanPurposeService.createContractLoanPurpose(form.value)
  toast.success('ดำเนินการสำเร็จ')
  await useFetch()
}
async function useUpdate (id: TBaseParamsId): Promise<void> {
  await ContractLoanPurposeService.updateContractLoanPurpose(id, form.value)
  toast.success('ดำเนินการสำเร็จ')
  await useFetch()
}
async function useDelete (id: TBaseParamsId): Promise<void> {
  await ContractLoanPurposeService.deleteContractLoanPurpose(id)
  toast.success('ดำเนินการสำเร็จ')
  await useFetch()
}

function onCreate (): void {
  handleLoading(useCreate)
}
function onUpdate (id: TBaseParamsId): void {
  handleLoading((): Promise<void> => useUpdate(id))
}
function onDelete (id: TBaseParamsId): void {
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
