<template>
  <section id="contract-loan-type-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ModalHowDidFindUsAction
        v-model="form"
        @create="onCreate()"
        @delete="onDelete($event)"
        @update="onUpdate($event)" />
    </BaseTop>
    <BasePage>
      <HowDidFindUsTable
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
import type { IActionHowDidFindUsPayload, IGetHowDidFindUsList } from '@/models/request/how-did-find-us/HowDidFindUsReq.model'
import type { IHowDidFindUsList } from '@/models/response/how-did-find-us/HowDidFindUsRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HowDidFindUsProvider, { type IHowDidFindUsProvider } from '@/resources/provider/how-did-find-us/HowDidFindUs.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import HowDidFindUsTable from '../components/HowDidFindUsTable.vue'
import ModalHowDidFindUsAction from '../components/ModalHowDidFindUsAction.vue'
import usePagination from '@/composables/usePagination'
import { useFormInitialValues } from '../schema/how-did-find-us.schema'

const HowDidFindUsService: IHowDidFindUsProvider = new HowDidFindUsProvider()

const form = ref<IActionHowDidFindUsPayload>(useFormInitialValues())
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const items = ref<IHowDidFindUsList[]>([])

const paginateQuery = computed((): IGetHowDidFindUsList => {
  return {
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value
  }
})

async function useFetch (): Promise<void> {
  const response = await HowDidFindUsService.getHowDidFindUsPaginate(paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery()
}

async function useCreate (): Promise<void> {
  await HowDidFindUsService.createHowDidFindUs(form.value)
  toast.success('ดำเนินการสำเร็จ')
  await useFetch()
}
async function useUpdate (id: TBaseParamsId): Promise<void> {
  await HowDidFindUsService.updateHowDidFindUs(id, form.value)
  toast.success('ดำเนินการสำเร็จ')
  await useFetch()
}
async function useDelete (id: TBaseParamsId): Promise<void> {
  await HowDidFindUsService.deleteHowDidFindUs(id)
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
