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
    <BasePage>
      <ContractLoanTypeTable
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
import type { IActionContractLoanTypePayload, IGetContractLoanTypeList } from '@/models/request/contract-loan-type/ContractLoanTypeReq.model'
import type { IContractLoanTypeList } from '@/models/response/contract-loan-type/ContractLoanTypeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import ContractLoanTypeProvider, { type IContractLoanTypeProvider } from '@/resources/provider/contract-loan-type/ContractLoanType.provider'
import BasePage from '@/components/base/BasePage.vue'
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
  await useFetch()
}
async function useUpdate (id: TBaseParamsId): Promise<void> {
  await ContractLoanTypeService.updateContractLoanType(id, form.value)
  toast.success('ดำเนินการสำเร็จ')
  await useFetch()
}
async function useDelete (id: TBaseParamsId): Promise<void> {
  await ContractLoanTypeService.deleteContractLoanType(id)
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
